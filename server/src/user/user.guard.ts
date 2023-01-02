import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common/interfaces";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthenticationError } from "apollo-server-express";

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    try {
      const req = ctx.req;
      if (!req.session.userId) {
        throw new AuthenticationError("Not authenticated");
      }
      return true;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}
