import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { LogoutDocument, MeDocument, MeQuery } from "../generated/graphql";

const Navbar = () => {
  const { data, loading } = useQuery(MeDocument);
  const [logout, { loading: logoutLoading }] = useMutation(LogoutDocument);
  const logoutUser = async () => {
    await logout({
      update(cache, { data }) {
        if (data.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: null,
            },
          });
        }
      },
    });
  };
  let body;
  if (loading) {
    body = null;
  } else if (!data.me) {
    body = (
      <>
        <div>
          <NextLink href="/login">Login</NextLink>
        </div>
        <div style={{ marginLeft: "10px" }}>
          <NextLink href="/register">Register</NextLink>
        </div>
      </>
    );
  } else {
    body = (
      <>
        <Box mt={2} mr={10}>
          {data.me.username}
        </Box>
        <NextLink href="/create-post">
          <Box mt={2} mx={3}>
            Create post
          </Box>
        </NextLink>
        <Button onClick={logoutUser} isLoading={logoutLoading}>
          <Box>Logout </Box>
        </Button>
      </>
    );
  }
  return (
    <Box bg="tan" p={1}>
      <Flex maxW="800" justifyContent="space-between" m="auto" align="center">
        <NextLink href="/">
          <Heading>Reddit</Heading>
        </NextLink>
        <Box display={"flex"}>{body}</Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
