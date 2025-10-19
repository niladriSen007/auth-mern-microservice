import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    // Numeric autoincrement id
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Explicitly declare column types so TypeORM doesn't need to guess
    @Column('text', { unique: true })
    email: string;

    @Column('varchar')
    password: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text')
    role: string;
}
