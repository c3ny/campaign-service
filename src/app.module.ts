import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsModule } from './campaigns/campaigns.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AppLoggerService } from './shared/logger/app-logger.service';
import { HttpLoggingInterceptor } from './shared/interceptors/http-logging.interceptor';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { CreateCampaignsTable1744588800000 } from './database/migrations/1744588800000-CreateCampaignsTable';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5434'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'campaign_db',
      autoLoadEntities: true,
      synchronize: false,
      migrations: [CreateCampaignsTable1744588800000],
      migrationsRun: true,
      // Heroku Postgres exige SSL. Dev local (DATABASE_SSL=false) usa conexao limpa.
      ssl:
        process.env.DATABASE_SSL === 'false'
          ? false
          : { rejectUnauthorized: false },
    }),
    CampaignsModule,
    SchedulesModule,
  ],
  providers: [
    {
      provide: AppLoggerService,
      useFactory: () => new AppLoggerService('campaign-service'),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
