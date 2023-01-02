import { NextPage } from "next";
import React from "react";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import { Box, Button, Link } from "@chakra-ui/react";
import InputField from "../components/InputField";
import {
  ChangePasswordDocument,
  ChangePasswordInput,
} from "../generated/graphql";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useCheckAuth } from "../utils/useCheckAuth";

const changePassword = () => {
  const router = useRouter();
  const [changePassword, { loading, data }] = useMutation(
    ChangePasswordDocument
  );
  const { data: authData, loading: authLoading } = useCheckAuth();

  const onChangePasswordSubmit = async (values: ChangePasswordInput) => {
    if (router.query.userId && router.query.token) {
      await changePassword({
        variables: {
          token: String(router.query.token),
          userId: String(router.query.userId),
          changePasswordInput: values,
        },
      });
    }

    router.replace("/");
  };
  return (
    <Wrapper>
      <Formik
        initialValues={{
          newPassword: "",
        }}
        onSubmit={onChangePasswordSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                label="newPassword"
                name="newPassword"
                placeholder="New Password"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
            <NextLink href={"/"}>Forgot Password</NextLink>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default changePassword;
