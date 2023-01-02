import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Post } from "src/post/post.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
