import { NextPage } from "next";
import React from "react";
import Wrapper from "../components/Wrapper";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import { ForgotPassDocument, ForgotPasswordInput } from "../generated/graphql";
import { useCheckAuth } from "../utils/useCheckAuth";

const ForgotPassword: NextPage = () => {
  const [forgotPassword, { loading, data }] = useMutation(ForgotPassDocument);
  const { data: authData, loading: authLoading } = useCheckAuth();

  const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
    await forgotPassword({
      variables: { forgotPasswordInput: values },
    });
  };
  return (
    <Wrapper>
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={onForgotPasswordSubmit}
      >
        {({ isSubmitting }) =>
          !loading && data ? (
            <Box>Please check your inbox</Box>
          ) : (
            <Form>
              <Box mt={4}>
                <InputField label="email" name="email" placeholder="Email" />
              </Box>
              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
