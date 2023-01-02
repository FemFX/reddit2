import {
  Args,
  Context,
  ID,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
  Root,
  Int,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePostInput } from "src/types/CreatePostInput";
import { PostMutationResponse } from "src/types/PostMutationResponse";
import { LessThan, Repository } from "typeorm";
import { Post } from "./post.entity";
import { PostService } from "./post.service";
import { UpdatePostInput } from "src/types/UpdatePostInput";
import { MyContext } from "src/types/Context";
import { UserGuard } from "src/user/user.guard";
import { UseGuards } from "@nestjs/common/decorators";
import { User } from "src/user/user.entity";
import { PaginatedPosts } from "src/types/PaginatedPosts";

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  @ResolveField(() => String)
  textSnippet(@Root() root: Post) {
    return `${root.text.slice(0, 40)}...`;
  }
  @ResolveField(() => User)
  async user(@Root() root: Post) {
    return await this.userRepository.findOne({ where: { id: root.userId } });
  }
  @UseGuards(UserGuard)
  @Mutation(() => PostMutationResponse)
  async createPost(
    @Args("createPostInput") { text, title }: CreatePostInput,
    @Context() { req }: MyContext
  ): Promise<PostMutationResponse> {
    try {
      const newPost = await this.postRepository
        .create({ text, title, userId: req.session.userId })
        .save();
      return {
        code: 200,
        success: true,
        message: "Post created",
        post: newPost,
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
  @Query(() => PaginatedPosts, { nullable: true })
  async posts(
    @Args("limit", { type: () => Int }) limit: number,
    @Args("cursor", { nullable: true }) cursor?: string
  ): Promise<PaginatedPosts> {
    try {
      const totalPostCount = await this.postRepository.count();
      const realLimit = Math.min(10, limit);

      const findOptions: { [key: string]: any } = {
        order: {
          createdAt: "DESC",
        },
        take: realLimit,
      };

      let lastPost: Post[] = [];
      if (cursor) {
        findOptions.where = { createdAt: LessThan(cursor) };

        lastPost = await this.postRepository.find({
          order: { createdAt: "ASC" },
          take: 1,
        });
      }
      const posts = await this.postRepository.find(findOptions);

      return {
        totalCount: totalPostCount,
        cursor: posts[posts.length - 1].createdAt,
        hasMore: cursor
          ? posts[posts.length - 1].createdAt.toString() !==
            lastPost[0].createdAt.toString()
          : posts.length !== totalPostCount,
        paginatedPosts: posts,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  @Query(() => Post, { nullable: true })
  async post(
    @Args("id", { type: () => ID }) id: number
  ): Promise<Post | undefined> {
    try {
      return await this.postRepository.findOne({ where: { id } });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  @UseGuards(UserGuard)
  @Mutation(() => PostMutationResponse)
  async updatePost(
    @Args("updatePostInput") { id, text, title }: UpdatePostInput,
    @Context() { req }: MyContext
  ): Promise<PostMutationResponse> {
    const isPostExists = await this.postRepository.findOne({ where: { id } });
    if (!isPostExists) {
      return {
        code: 400,
        success: false,
        message: "Post not found",
      };
    }
    if (isPostExists.userId !== req.session.userId) {
      return {
        code: 401,
        success: false,
        message: "You dont have permission",
      };
    }
    isPostExists.title = title;
    isPostExists.text = text;
    await this.postRepository.save(isPostExists);
    return {
      code: 200,
      success: true,
      message: "Post updated successfully",
      post: isPostExists,
    };
  }
  @UseGuards(UserGuard)
  @Mutation(() => PostMutationResponse)
  async deletePost(
    @Args("id", { type: () => ID }) id: number
  ): Promise<PostMutationResponse> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      return {
        code: 400,
        success: false,
        message: "Post not found",
      };
    }
    await this.postRepository.delete({ id });
    return {
      code: 200,
      success: true,
      message: "Post deleted successfully",
    };
  }
}
