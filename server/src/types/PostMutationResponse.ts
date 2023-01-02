import { Field, ObjectType } from "@nestjs/graphql";
import { Post } from "src/post/post.entity";
import { FieldError } from "./FieldError";
import { IMutationResponse } from "./MutationResponse";

@ObjectType({ implements: IMutationResponse })
export class PostMutationResponse implements IMutationResponse {
  code: number;
  success: boolean;
  message?: string;

  @Field({ nullable: true })
  post?: Post;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
