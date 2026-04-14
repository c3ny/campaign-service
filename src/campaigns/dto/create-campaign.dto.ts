import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  IsEnum,
  IsUrl,
  ValidateNested,
  IsLatitude,
  IsLongitude,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignStatus } from '../entities/campaign.entity';

export class CampaignLocationDto {
  @ApiProperty({ example: 'Hemocentro Central SP' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Rua Voluntários da Pátria, 100' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: 'UF deve ter exatamente 2 letras maiúsculas' })
  uf: string;

  @ApiPropertyOptional({ example: '01234-567' })
  @IsString()
  @IsOptional()
  zipcode?: string;

  @ApiProperty({ example: -23.5505 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: -46.6333 })
  @IsLongitude()
  longitude: number;
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Doação urgente tipo O-' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Precisamos de doadores com urgência' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/banner.jpg' })
  @IsUrl()
  @IsOptional()
  bannerImage?: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-05-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    example: 'O-',
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Todos'],
  })
  @IsString()
  @IsOptional()
  bloodType?: string;

  @ApiProperty({ type: CampaignLocationDto })
  @ValidateNested()
  @Type(() => CampaignLocationDto)
  location: CampaignLocationDto;

  @ApiProperty({ example: 'uuid-da-empresa' })
  @IsUUID()
  organizerId: string;

  @ApiProperty({ example: 'Hemocentro Central SP' })
  @IsString()
  @IsNotEmpty()
  organizerName: string;

  @ApiPropertyOptional({ example: 'hemocentro-central-sp' })
  @IsString()
  @IsOptional()
  organizerUsername?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  targetDonations?: number;

  @ApiPropertyOptional({ enum: CampaignStatus, default: CampaignStatus.ACTIVE })
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;
}
