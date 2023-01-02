import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Post } from "src/post/post.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;
  @Column({ unique: true })
  @Field()
  username: string;
  @Column({ unique: true })
  @Field()
  email: string;
  @Column()
  @Field()
  password: string;
  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @CreateDateColumn()
  @Field()
  createdAt: Date;
  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
