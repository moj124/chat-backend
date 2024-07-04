import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array")
    participants: number[];

    @Column("simple-array")
    messages: number[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deleteAt: Date;
}