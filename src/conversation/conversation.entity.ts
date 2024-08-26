import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Conversations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int', {array: true})
  participants: number[];

  @Column('int', {array: true})
  messages: number[];

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;

  @DeleteDateColumn({ nullable: true })
  deleteat: Date | null;
}