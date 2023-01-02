import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./user/user.entity";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { Post } from "./post/post.entity";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UserResolver } from "./user/user.resolver";
import { PostResolver } from "./post/post.resolver";
import { MyContext } from "./types/Context";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: process.env.DATABASE,
      logging: true,
      synchronize: true,
      entities: [User, Post],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      cors: false,
      context: ({ req, res }): MyContext => ({ req, res }),
    }),
    TypeOrmModule.forFeature([User, Post]),
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
