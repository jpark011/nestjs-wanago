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
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

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

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}

export default Post;
