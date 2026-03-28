//Github é pessimo//

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Doação urgente tipo O-' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Precisamos de doadores com urgência' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'O-',
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(A|B|AB|O)[+-]$/, { message: 'Tipo sanguíneo inválido' })
  bloodType: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @Length(2, 2, { message: 'UF deve ter exatamente 2 letras' })
  uf: string;

  @ApiProperty({ example: 'uuid-da-empresa' })
  @IsUUID()
  companyId: string;
}
