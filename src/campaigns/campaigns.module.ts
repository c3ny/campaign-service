import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Campaign } from './entities/campaign.entity';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { JwtStrategy } from '../shared/auth/jwt.strategy';
import { JwtAuthGuard } from '../shared/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), PassportModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, JwtStrategy, JwtAuthGuard],
})
export class CampaignsModule {}
