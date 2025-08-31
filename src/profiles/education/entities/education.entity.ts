// src/profiles/education/entities/education.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../users/shared/user.entity';

@Entity('educations')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  school!: string;

  @Column({ nullable: true })
  degree?: string;

  @Column({ name: 'field_of_study', nullable: true })
  fieldOfStudy?: string;

  @Column({ nullable: true })
  grade?: string;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}

