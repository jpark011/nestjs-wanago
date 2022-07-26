import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export default Post;
