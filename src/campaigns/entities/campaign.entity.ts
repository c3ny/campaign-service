import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CampaignLocation {
  name: string;
  address: string;
  city: string;
  uf: string;
  zipcode?: string;
  latitude: number;
  longitude: number;
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  bannerImage: string | null;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bloodType: string | null;

  @Column({ type: 'jsonb' })
  location: CampaignLocation;

  @Column({ type: 'uuid' })
  organizerId: string;

  @Column({ type: 'varchar', length: 255 })
  organizerName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organizerUsername: string | null;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.ACTIVE,
  })
  status: CampaignStatus;

  @Column({ type: 'int', default: 0 })
  currentDonations: number;

  @Column({ type: 'int', nullable: true })
  targetDonations: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
