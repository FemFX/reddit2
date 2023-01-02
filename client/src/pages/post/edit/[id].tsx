import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import {
  MeDocument,
  PostDocument,
  UpdatePostDocument,
  UpdatePostInput,
} from "../../../generated/graphql";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import InputField from "../../../components/InputField";
import NextLink from "next/link";
import { Omit } from "lodash";

const EditPost = () => {
  const router = useRouter();
  const [updatePost] = useMutation(UpdatePostDocument);
  const { data: meData, loading: meLoading } = useQuery(MeDocument);
  const { data: postData, loading: postLoading } = useQuery(PostDocument, {
    variables: {
      id: String(router.query.id),
    },
  });

  const { data, loading } = useQuery(PostDocument, {
    variables: {
      id: String(router.query.id),
    },
  });
  const onUpdatePostSubmit = async (values: Omit<UpdatePostInput, "id">) => {
    await updatePost({
      variables: {
        updatePostInput: {
          id: String(router.query.id),
          ...values,
        },
      },
    });
    router.replace("/");
  };
  if (loading || meLoading || postLoading) {
    <Flex justifyContent="center" alignItems="center" minH="100vh">
      <Spinner />
    </Flex>;
  }
  if (
    !loading &&
    !meLoading &&
    !postLoading &&
    meData?.me?.id !== String(data?.post.userId)
  ) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>You dont have permission</AlertTitle>
        </Alert>
      </Layout>
    );
  }
  if (!postData?.post) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Post not found</AlertTitle>
        </Alert>
      </Layout>
    );
  }
  return (
    <Layout>
      <Formik
        initialValues={{
          title: postData?.post?.title,
          text: postData?.post?.text,
        }}
        onSubmit={onUpdatePostSubmit}
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
            <Flex mt={2} justifyContent="space-between" alignItems={"center"}>
              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Update
              </Button>
              <NextLink href="/">Go back to home</NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditPost;
