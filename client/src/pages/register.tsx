import { Box, Button, useToast } from "@chakra-ui/react";
import { Formik, Form, FormikHelpers } from "formik";
import React from "react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import {
  MeDocument,
  MeQuery,
  RegisterDocument,
  RegisterInput,
} from "../generated/graphql";
import { mapFieldErrors } from "../helpers/mapFieldErrors";
import { useRouter } from "next/router";
import { NextPage } from "next";

const Register: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [registerUser] = useMutation(RegisterDocument);
  const onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const response = await registerUser({
      variables: {
        registerInput: values,
      },
      update(cache, { data }) {
        if (data.register.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.register.user,
            },
          });
        }

        // const meData = cache.readQuery({ query: MeDocument });
        // console.log("me", meData);
      },
    });
    if (response.data.register.errors) {
      setErrors(mapFieldErrors(response.data.register.errors));
    } else if (response.data.register.user) {
      toast({
        title: "Welcome",
        description: `${response.data.register.user.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    }
  };
  return (
    <Wrapper>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={onRegisterSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                label="username"
                name="username"
                placeholder="Username"
              />
            </Box>
            <Box mt={4}>
              <InputField label="email" name="email" placeholder="Email" />
            </Box>
            <Box mt={4}>
              <InputField
                label="password"
                name="password"
                placeholder="Password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              colorScheme="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
