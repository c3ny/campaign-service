import { PartialType } from '@nestjs/swagger';
import { CreateCampaignDto } from './create-campaign.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
