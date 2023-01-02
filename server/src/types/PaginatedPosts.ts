import { Field, ObjectType } from "@nestjs/graphql";
import { Post } from "src/post/post.entity";

@ObjectType()
export class PaginatedPosts {
  @Field()
  totalCount: number;
  @Field(() => Date)
  cursor: Date;
  @Field()
  hasMore: boolean;
  @Field(() => [Post])
  paginatedPosts: Post[];
}
