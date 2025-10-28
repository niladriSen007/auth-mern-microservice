import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './User.js';

@Entity('refreshTokens')
export class RefreshToken {
    // Numeric autoincrement id
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Explicitly declare column types so TypeORM doesn't need to guess
    @Column('timestamp')
    expiresAt: Date;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
