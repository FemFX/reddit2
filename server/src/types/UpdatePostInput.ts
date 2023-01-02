import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  id: number;
  @Field()
  title: string;
  @Field()
  text: string;
}
