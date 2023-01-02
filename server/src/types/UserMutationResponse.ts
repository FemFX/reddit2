import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import { FieldError } from "./FieldError";
import { IMutationResponse } from "./MutationResponse";

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
  code: number;
  success: boolean;
  message?: string;
  @Field({ nullable: true })
  user?: User;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
