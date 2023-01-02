import { useQuery } from "@apollo/client";
import React from "react";
import {
  PostDocument,
  PostIdsDocument,
  PostIdsQuery,
  PostIdsQueryVariables,
  PostQuery,
  PostQueryVariables,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { GetStaticPaths, GetStaticProps } from "next";
import { addApolloState, initializeApollo } from "../../lib/apolloClient";

const Post = (props: any) => {
  const { query } = useRouter();

  // console.log(props.__APOLLO_STATE__[`Post:${query.id}`].title);

  const { data, loading, error } = useQuery(PostDocument, {
    variables: {
      id: String(query.id),
    },
  });
  if (error || !data?.post) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error?.message || "Post not found"}</AlertTitle>
        </Alert>
      </Layout>
    );
  }
  return (
    <Layout>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading mb={4}>{data.post.title}</Heading>
          <Box mb={4}>{data.post.text}</Box>
        </>
      )}
    </Layout>
  );
};
export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const res = await apolloClient.query<PostIdsQuery, PostIdsQueryVariables>({
    query: PostIdsDocument,
    variables: {
      limit: 3,
    },
  });
  // console.log(res.data.posts.paginatedPosts);
  return {
    paths: res.data.posts.paginatedPosts.map((p) => ({
      params: { id: `${p.id}` },
    })),
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const apolloClient = initializeApollo();
  // console.log(params);

  await apolloClient.query<PostQuery, PostQueryVariables>({
    query: PostDocument,
    variables: {
      id: params.id,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Post;
