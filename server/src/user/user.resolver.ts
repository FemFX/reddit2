import { Context, ResolveField, Resolver, Root } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { Query, Mutation, Args } from "@nestjs/graphql";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hash, verify } from "argon2";
import { UserMutationResponse } from "src/types/UserMutationResponse";
import { RegisterInput } from "src/types/RegisterInput";
import { validateRegisterInput } from "src/utils/validateRegisterInput";
import { LoginInput } from "src/types/LoginInput";
import { MyContext } from "src/types/Context";
import { COOKIE_NAME } from "src/constants";
import { ForgotPasswordInput } from "src/types/ForgotPasswordInput";
import { sendEmail } from "src/utils/sendEmail";
import { TokenModel } from "src/models/Token";
import { v4 as uuidv4 } from "uuid";
import { ChangePasswordInput } from "src/types/ChangePasswordInput";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  @ResolveField(() => String)
  email(@Root() user: User, @Context() { req }: MyContext) {
    return req.session.userId === user.id ? user.email : "";
  }
  @Query(() => User, { nullable: true })
  async me(@Context() { req }: MyContext): Promise<User | null | undefined> {
    if (!req.session.userId) {
      return null;
    }
    const user = await this.userRepository.findOne({
      where: { id: req.session.userId },
    });
    return user;
  }
  @Query(() => String)
  async hello(@Context() { req }: MyContext): Promise<string> {
    console.log(req.session.userId);

    return "hello";
  }
  @Mutation(() => UserMutationResponse, { nullable: true })
  async register(
    @Args("registerInput") { email, username, password }: RegisterInput,
    @Context() { req }: MyContext
  ): Promise<UserMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput({
      email,
      username,
      password,
    });
    if (validateRegisterInputErrors !== null)
      return { code: 400, success: false, ...validateRegisterInputErrors };
    try {
      const isUserExits = await this.userRepository.findOneBy([
        { username },
        { email },
      ]);
      if (isUserExits) {
        return {
          code: 400,
          success: false,
          message: "User already exists",
          errors: [
            {
              field: isUserExits.username === username ? "username" : "email",
              message: "Username or email already taken",
            },
          ],
        };
      }
      const hashedPass = await hash(password);
      const newUser = await this.userRepository
        .create({
          username,
          email,
          password: hashedPass,
        })
        .save();

      req.session.userId = newUser.id;
      return {
        code: 200,
        success: true,
        message: "User created",
        user: newUser,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${err.message}`,
      };
    }
  }
  @Mutation(() => UserMutationResponse)
  async login(
    @Args("loginInput") { usernameOrEmail, password }: LoginInput,
    @Context() { req }: MyContext
  ): Promise<UserMutationResponse> {
    try {
      const isUserExits = await this.userRepository.findOneBy(
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );
      if (!isUserExits) {
        return {
          code: 400,
          success: false,
          message: "User not found",
          errors: [
            {
              field: "usernameOrEmail",
              message: "Username or email incorrect",
            },
          ],
        };
      }
      const isPassEquals = await verify(isUserExits.password, password);
      if (!isPassEquals) {
        return {
          code: 400,
          success: false,
          message: "Wrong password",
          errors: [
            {
              field: "password",
              message: "Wrong password",
            },
          ],
        };
      }
      // session:userId = isUserExits.id
      req.session.userId = isUserExits.id;
      return {
        code: 200,
        success: true,
        message: "Logged in successfully",
        user: isUserExits,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${err.message}`,
      };
    }
  }
  @Mutation(() => Boolean)
  async logout(@Context() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);
      req.session.destroy((error) => {
        if (error) {
          console.log("DESTROYING SESSION ERROR ", error);
          resolve(false);
        }
        resolve(true);
      });
    });
  }
  @Mutation(() => Boolean)
  async forgotPass(
    @Args("forgotPasswordInput") forgotPasswordInput: ForgotPasswordInput
  ): Promise<Boolean> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordInput.email },
    });
    if (!user) {
      return false;
    }

    await TokenModel.findOneAndDelete({ userId: `${user.id}` });

    const token = uuidv4();
    const hashedToken = await hash(token);

    //save token to db
    await new TokenModel({ userId: `${user.id}`, token: hashedToken }).save();
    //send reset pass link to user
    await sendEmail(
      forgotPasswordInput.email,
      ` <a href="http://localhost:3000/change-password?token=${token}&userId=${user.id}">Click here to reset your password</a>`
    );
    return true;
  }
  @Mutation(() => UserMutationResponse)
  async changePassword(
    @Args("token") token: string,
    @Args("userId") userId: string,
    @Args("changePasswordInput") changePasswordInput: ChangePasswordInput,
    @Context() { req }: MyContext
  ): Promise<UserMutationResponse> {
    if (changePasswordInput.newPassword.length <= 2) {
      return {
        code: 400,
        success: false,
        message: "Invalid password",
        errors: [{ field: "newPassword", message: "Invalid password" }],
      };
    }
    try {
      const resetPasswordToken = await TokenModel.findOne({ userId });
      if (!resetPasswordToken) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired password reset token",
          errors: [
            {
              field: "token",
              message: "Invalid or expired password reset token",
            },
          ],
        };
      }
      const resetPasswordTokenValid = verify(resetPasswordToken.token, token);
      if (!resetPasswordTokenValid) {
        return {
          code: 400,
          success: false,
          message: "Invalid or expired password reset token",
          errors: [
            {
              field: "token",
              message: "Invalid or expired password reset token",
            },
          ],
        };
      }
      const userIdNum = parseInt(userId);
      const user = await this.userRepository.findOne({
        where: { id: userIdNum },
      });
      if (!user) {
        return {
          code: 400,
          success: false,
          message: "User not found",
          errors: [
            {
              field: "user",
              message: "User not found",
            },
          ],
        };
      }
      const updatedPassword = await hash(changePasswordInput.newPassword);
      await this.userRepository.update(
        { id: userIdNum },
        { password: updatedPassword }
      );
      await resetPasswordToken.deleteOne();
      req.session.userId = user.id;
      return {
        code: 200,
        success: true,
        message: "User password reset successfully",
        user,
      };
    } catch (err) {
      console.log(err);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${err.message}`,
      };
    }
  }
}
