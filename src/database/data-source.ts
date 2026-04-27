import { DataSource } from 'typeorm';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { CreateCampaignsTable1744588800000 } from './migrations/1744588800000-CreateCampaignsTable';
import { AlignOrganizerIdWithEntityCompanyId1745800000000 } from './migrations/1745800000000-AlignOrganizerIdWithEntityCompanyId';

import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'campaign_db',
  entities: [Campaign],
  migrations: [
    CreateCampaignsTable1744588800000,
    AlignOrganizerIdWithEntityCompanyId1745800000000,
  ],
  migrationsTableName: 'migrations',
});
