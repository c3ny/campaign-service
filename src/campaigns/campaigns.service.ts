import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, LessThan } from 'typeorm';
import { Campaign, CampaignStatus } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

export interface ListCampaignsOptions {
  status?: CampaignStatus;
  organizerId?: string;
  bloodType?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCampaigns {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  /**
   * Auto-completes ACTIVE campaigns whose endDate has passed.
   * Idempotent: runs on every read so stale statuses get corrected lazily.
   */
  private async autoCompleteExpired(): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    await this.campaignRepo.update(
      { status: CampaignStatus.ACTIVE, endDate: LessThan(today) },
      { status: CampaignStatus.COMPLETED },
    );
  }

  async findAll(options: ListCampaignsOptions = {}): Promise<PaginatedCampaigns> {
    await this.autoCompleteExpired();

    const { status, organizerId, bloodType, page = 1, limit = 12 } = options;

    const where: FindManyOptions<Campaign>['where'] = {};

    if (status) where.status = status;
    if (organizerId) where.organizerId = organizerId;
    if (bloodType) where.bloodType = bloodType;

    const [data, total] = await this.campaignRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Campaign> {
    await this.autoCompleteExpired();
    const campaign = await this.campaignRepo.findOneBy({ id });
    if (!campaign) throw new NotFoundException(`Campanha ${id} não encontrada`);
    return campaign;
  }

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepo.create({
      ...dto,
      bannerImage: dto.bannerImage ?? null,
      bloodType: dto.bloodType ?? null,
      organizerUsername: dto.organizerUsername ?? null,
      targetDonations: dto.targetDonations ?? null,
      status: dto.status ?? CampaignStatus.ACTIVE,
      currentDonations: 0,
    });

    return this.campaignRepo.save(campaign);
  }

  async update(id: string, dto: UpdateCampaignDto, requesterId: string): Promise<Campaign> {
    const campaign = await this.findOne(id);

    if (campaign.organizerId !== requesterId) {
      throw new ForbiddenException('Sem permissão para editar esta campanha');
    }

    if (dto.status && dto.status !== campaign.status) {
      const isInactive =
        campaign.status === CampaignStatus.COMPLETED ||
        campaign.status === CampaignStatus.CANCELLED;
      if (isInactive) {
        throw new BadRequestException(
          'Campanhas concluídas ou canceladas não podem ter o status alterado',
        );
      }
    }

    const updated = this.campaignRepo.merge(campaign, dto);
    return this.campaignRepo.save(updated);
  }

  async remove(id: string, requesterId: string): Promise<void> {
    const campaign = await this.findOne(id);

    if (campaign.organizerId !== requesterId) {
      throw new ForbiddenException('Sem permissão para remover esta campanha');
    }

    await this.campaignRepo.remove(campaign);
  }
}
