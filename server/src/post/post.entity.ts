import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;
  @Column()
  @Field()
  title: string;
  @Column()
  @Field()
  text: string;
  // @Field()
  // shortedText:string
  @Column({ nullable: true })
  @Field({ nullable: true })
  userId: number;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  user: User;
  @Field()
  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;
  @Field()
  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt: Date;
}
