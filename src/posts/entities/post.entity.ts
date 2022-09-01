import { Category } from './category.entity';
import { Transform } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
@Index('multi', ['id', 'author'])
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

  @Column('text', { array: true, default: [] })
  paragraphs: string[];

  @Column()
  title: string;

  @JoinTable()
  @ManyToMany(() => Category)
  categories: Category[];

  @ManyToOne(() => User, (user) => user.posts)
  @Index('post_authorId_index')
  author: User;
}

export default Post;
