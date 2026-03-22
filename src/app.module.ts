import { Module } from '@nestjs/common';
import { CampaignsModule } from './campaigns/campaigns.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [CampaignsModule, SchedulesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
