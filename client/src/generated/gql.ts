/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "fragment userInfo on User {\n  id\n  username\n  email\n  password\n  createdAt\n  updatedAt\n}": types.UserInfoFragmentDoc,
    "fragment userMutationResponse on UserMutationResponse {\n  code\n  success\n  message\n  user {\n    ...userInfo\n  }\n  errors {\n    field\n    message\n  }\n}": types.UserMutationResponseFragmentDoc,
    "mutation ChangePassword($token: String!, $userId: String!, $changePasswordInput: ChangePasswordInput!) {\n  changePassword(\n    token: $token\n    userId: $userId\n    changePasswordInput: $changePasswordInput\n  ) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.ChangePasswordDocument,
    "mutation CreatePost($createPostInput: CreatePostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    code\n    message\n    success\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.CreatePostDocument,
    "mutation DeletePost($id: ID!) {\n  deletePost(id: $id) {\n    code\n    success\n    message\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.DeletePostDocument,
    "mutation ForgotPass($forgotPasswordInput: ForgotPasswordInput!) {\n  forgotPass(forgotPasswordInput: $forgotPasswordInput)\n}": types.ForgotPassDocument,
    "mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.RegisterDocument,
    "mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    code\n    success\n    message\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}": types.UpdatePostDocument,
    "query Hello {\n  hello\n}": types.HelloDocument,
    "query Me {\n  me {\n    id\n    username\n    email\n    password\n    createdAt\n    updatedAt\n  }\n}": types.MeDocument,
    "query Post($id: ID!) {\n  post(id: $id) {\n    id\n    title\n    text\n    createdAt\n    updatedAt\n    userId\n    user {\n      id\n      username\n    }\n  }\n}": types.PostDocument,
    "query PostIds($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    paginatedPosts {\n      id\n    }\n  }\n}": types.PostIdsDocument,
    "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      textSnippet\n      userId\n      user {\n        id\n        username\n      }\n      createdAt\n    }\n  }\n}": types.PostsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userInfo on User {\n  id\n  username\n  email\n  password\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment userInfo on User {\n  id\n  username\n  email\n  password\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userMutationResponse on UserMutationResponse {\n  code\n  success\n  message\n  user {\n    ...userInfo\n  }\n  errors {\n    field\n    message\n  }\n}"): (typeof documents)["fragment userMutationResponse on UserMutationResponse {\n  code\n  success\n  message\n  user {\n    ...userInfo\n  }\n  errors {\n    field\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangePassword($token: String!, $userId: String!, $changePasswordInput: ChangePasswordInput!) {\n  changePassword(\n    token: $token\n    userId: $userId\n    changePasswordInput: $changePasswordInput\n  ) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation ChangePassword($token: String!, $userId: String!, $changePasswordInput: ChangePasswordInput!) {\n  changePassword(\n    token: $token\n    userId: $userId\n    changePasswordInput: $changePasswordInput\n  ) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($createPostInput: CreatePostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    code\n    message\n    success\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation CreatePost($createPostInput: CreatePostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    code\n    message\n    success\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeletePost($id: ID!) {\n  deletePost(id: $id) {\n    code\n    success\n    message\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation DeletePost($id: ID!) {\n  deletePost(id: $id) {\n    code\n    success\n    message\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ForgotPass($forgotPasswordInput: ForgotPasswordInput!) {\n  forgotPass(forgotPasswordInput: $forgotPasswordInput)\n}"): (typeof documents)["mutation ForgotPass($forgotPasswordInput: ForgotPasswordInput!) {\n  forgotPass(forgotPasswordInput: $forgotPasswordInput)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    success\n    message\n    user {\n      id\n      username\n      email\n      password\n      createdAt\n      updatedAt\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    code\n    success\n    message\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"): (typeof documents)["mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    code\n    success\n    message\n    post {\n      text\n      title\n      id\n      createdAt\n      updatedAt\n      user {\n        username\n      }\n    }\n    errors {\n      field\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Hello {\n  hello\n}"): (typeof documents)["query Hello {\n  hello\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    id\n    username\n    email\n    password\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query Me {\n  me {\n    id\n    username\n    email\n    password\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Post($id: ID!) {\n  post(id: $id) {\n    id\n    title\n    text\n    createdAt\n    updatedAt\n    userId\n    user {\n      id\n      username\n    }\n  }\n}"): (typeof documents)["query Post($id: ID!) {\n  post(id: $id) {\n    id\n    title\n    text\n    createdAt\n    updatedAt\n    userId\n    user {\n      id\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PostIds($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    paginatedPosts {\n      id\n    }\n  }\n}"): (typeof documents)["query PostIds($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    paginatedPosts {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      textSnippet\n      userId\n      user {\n        id\n        username\n      }\n      createdAt\n    }\n  }\n}"): (typeof documents)["query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    totalCount\n    cursor\n    hasMore\n    paginatedPosts {\n      id\n      title\n      text\n      createdAt\n      updatedAt\n      textSnippet\n      userId\n      user {\n        id\n        username\n      }\n      createdAt\n    }\n  }\n}"];

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function graphql(source: string): unknown;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;