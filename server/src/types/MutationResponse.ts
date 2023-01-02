import { Field, InterfaceType } from "@nestjs/graphql";

@InterfaceType()
export abstract class IMutationResponse {
  @Field()
  code: number;
  @Field()
  success: boolean;
  @Field({ nullable: true })
  message?: string;
}
