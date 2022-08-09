import { PublicFile } from './../../files/public-file.entity';
import { Address } from './address.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Post from '../../posts/entities/post.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @JoinColumn()
  @OneToOne(() => Address, { eager: true, cascade: true })
  address: Address;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @JoinColumn()
  @OneToOne(() => PublicFile, { eager: true, nullable: true })
  avatar?: PublicFile;

  @Column({ nullable: true })
  @Exclude()
  currentRefreshToken?: string;
}

export default User;
