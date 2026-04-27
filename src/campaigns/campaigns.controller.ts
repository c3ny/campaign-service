import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus } from './entities/campaign.entity';
import { JwtAuthGuard } from '../shared/auth/jwt-auth.guard';
import { SkipAuth } from '../shared/auth/skip-auth.decorator';

interface AuthenticatedRequest extends Request {
  user: { userId: string; companyId: string | null; personType: string };
}

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: 'Listar campanhas (público)' })
  @ApiQuery({ name: 'status', required: false, enum: CampaignStatus })
  @ApiQuery({ name: 'organizerId', required: false })
  @ApiQuery({ name: 'bloodType', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['startDate', 'createdAt'] })
  findAll(
    @Query('status') status?: CampaignStatus,
    @Query('organizerId') organizerId?: string,
    @Query('bloodType') bloodType?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    const normalizedSort: 'startDate' | 'createdAt' | undefined =
      sort === 'startDate' || sort === 'createdAt' ? sort : undefined;

    return this.campaignsService.findAll({
      status,
      organizerId,
      bloodType,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 12,
      sort: normalizedSort,
    });
  }

  @SkipAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar campanha por ID (público)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.campaignsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar campanha (requer JWT de empresa)' })
  create(
    @Body() dto: CreateCampaignDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.campaignsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campanha (somente organizador)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCampaignDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // organizerId is the entity company.id; fall back to userId for legacy
    // tokens issued before users-service started populating companyId.
    const requesterId = req.user.companyId ?? req.user.userId;
    return this.campaignsService.update(id, dto, requesterId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover campanha (somente organizador)' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const requesterId = req.user.companyId ?? req.user.userId;
    return this.campaignsService.remove(id, requesterId);
  }
}
