import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostResolver } from "./post.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { User } from "../user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  providers: [PostResolver, PostService],
})
export class PostModule {}
