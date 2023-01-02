import React from "react";
import { useCheckAuth } from "../utils/useCheckAuth";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import NextLink from "next/link";
import { useMutation } from "@apollo/client";
import { CreatePostDocument, CreatePostInput } from "../generated/graphql";
import { useRouter } from "next/router";

const createPostPage = () => {
  const router = useRouter();
  const { data: authData, loading: authLoading } = useCheckAuth();
  const [createPost] = useMutation(CreatePostDocument);
  const onCreatePostSubmit = async (values: CreatePostInput) => {
    await createPost({
      variables: {
        createPostInput: values,
      },
      update(cache, { data }) {
        cache.modify({
          fields: {
            posts(existing) {
              if (data?.createPost.success && data.createPost.post) {
                // Post:new_id
                const newPostRef = cache.identify(data.createPost.post);

                const newPostsAfterCreation = {
                  ...existing,
                  totalCount: existing.totalCount + 1,
                  paginatedPosts: [
                    { __ref: newPostRef },
                    ...existing.paginatedPosts, // [{__ref: 'Post:1'}, {__ref: 'Post:2'}]
                  ],
                };

                return newPostsAfterCreation;
              }
            },
          },
        });
      },
    });
    router.push("/");
  };
  return (
    <>
      {authLoading || (!authLoading && !authData?.me) ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Layout>
          <Formik
            initialValues={{ title: "", text: "" }}
            onSubmit={onCreatePostSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box mt={4}>
                  <InputField label="title" name="title" placeholder="title" />
                </Box>
                <Box mt={4}>
                  <InputField
                    label="text"
                    name="text"
                    placeholder="text"
                    textarea
                  />
                </Box>
                <Flex
                  mt={2}
                  justifyContent="space-between"
                  alignItems={"center"}
                >
                  <Button
                    type="submit"
                    colorScheme="teal"
                    mt={4}
                    isLoading={isSubmitting}
                  >
                    Create
                  </Button>
                  <NextLink href="/">Go back to home</NextLink>
                </Flex>
              </Form>
            )}
          </Formik>
        </Layout>
      )}
    </>
  );
};

export default createPostPage;
