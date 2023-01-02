import { NetworkStatus, useMutation, useQuery } from "@apollo/client";
import Navbar from "../components/Navbar";
import {
  DeletePostDocument,
  MeDocument,
  PostsDocument,
  PostsQuery,
  PostsQueryVariables,
} from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "../components/Layout";
import { GetStaticPropsContext } from "next";

const Index = (props: any) => {
  console.log("props", props.__APOLLO_STATE__[`Post:${1}`]);

  const { data: meData } = useQuery(MeDocument);
  const { data, loading, error, fetchMore, networkStatus } = useQuery(
    PostsDocument,
    {
      variables: { limit: 5 },
      notifyOnNetworkStatusChange: true,
    }
  );
  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;
  const loadMorePosts = () =>
    fetchMore({ variables: { cursor: data.posts.cursor, limit: 10 } });
  const [deletePost] = useMutation(DeletePostDocument, {
    refetchQueries: [{ query: PostsDocument, variables: { limit: 5 } }],
  });
  const onPostDelete = async (postId: string) => {
    await deletePost({
      variables: {
        id: postId,
      },
      // update(cache, { data }) {
      //   if (data.deletePost.success) {
      //     cache.modify({
      //       fields: {
      //         posts(existing, incoming) {
      //           // console.log(existing);
      //           // console.log("-------");
      //           // console.log(incoming);
      //           // const newPostsAfterDelete = {
      //           //   ...existing,
      //           //   totalCount: existing.totalCount - 1,
      //           // };
      //         },
      //       },
      //     });
      //   }
      // },
    });
  };
  return (
    <Layout>
      {loading && !loadingMorePosts ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing={8}>
          {data.posts?.paginatedPosts.map((p, idx) => (
            <Flex key={idx} p={5} shadow="md" borderWidth="1px">
              <Box flex={1}>
                <NextLink href={`/post/${p.id}`}>
                  <Heading>{p.title}</Heading>
                </NextLink>
                <Text>posted by {p.user.username}</Text>
                <Flex align="center">
                  <Text mt={4}>{p.textSnippet}</Text>
                  {meData?.me?.id === p.user.id && (
                    <>
                      <Button colorScheme={"blue"} ml="auto">
                        <NextLink href={`/post/edit/${p.id}`}> Edit</NextLink>
                      </Button>
                      <Button
                        colorScheme={"red"}
                        ml="auto"
                        onClick={onPostDelete.bind(this, p.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {!loading && data.posts.hasMore && (
        <Button
          colorScheme="blue"
          m="auto"
          my={8}
          isLoading={loadingMorePosts}
          onClick={loadMorePosts}
        >
          Load more
        </Button>
      )}
    </Layout>
  );
};

export default Index;

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  console.log(ctx);

  const apolloClient = initializeApollo();

  await apolloClient.query<PostsQuery, PostsQueryVariables>({
    query: PostsDocument,
    variables: {
      limit: 10,
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};
