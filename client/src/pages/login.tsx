import { Box, Button, Flex, Link, Spinner, useToast } from "@chakra-ui/react";
import { Formik, Form, FormikHelpers } from "formik";
import React from "react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import {
  LoginDocument,
  LoginInput,
  MeDocument,
  MeQuery,
} from "../generated/graphql";
import { mapFieldErrors } from "../helpers/mapFieldErrors";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useCheckAuth } from "../utils/useCheckAuth";
import NextLink from "next/link";

const Login: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { data: authData, loading: authLoading } = useCheckAuth();
  const [loginUser] = useMutation(LoginDocument);
  const onLoginSubmit = async (
    values: any,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
      update(cache, { data }) {
        if (data.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          });
        }

        // const meData = cache.readQuery({ query: MeDocument });
        // console.log("me", meData);
      },
    });
    if (response.data.login.errors) {
      setErrors(mapFieldErrors(response.data.login.errors));
    } else if (response.data.login) {
      toast({
        title: "Welcome",
        description: `${response.data.login.user.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    }
  };
  return (
    <Wrapper size="small">
      {authLoading || (!authLoading && authData.me) ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper>
          <Formik
            initialValues={{
              usernameOrEmail: "",
              password: "",
            }}
            onSubmit={onLoginSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box mt={4}>
                  <InputField
                    label="usernameOrEmail"
                    name="usernameOrEmail"
                    placeholder="Username or Email"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    label="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                </Box>
                <Flex mt={2}>
                  <NextLink href={"/forgot-password"}>Forgot Password</NextLink>
                </Flex>
                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </Wrapper>
  );
};

export default Login;
