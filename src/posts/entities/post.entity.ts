import { Category } from './category.entity';
import { Transform } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  // @Transform((content) => {
  //   if (content !== null) {
  //     return content;
  //   }
  // })
  content: string;

  @Column()
  title: string;

  @JoinTable()
  @ManyToMany(() => Category)
  categories: Category[];

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}

export default Post;
