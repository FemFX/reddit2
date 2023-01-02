import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { Post } from "../generated/graphql";

// const client = new ApolloClient({
//   uri: "http://localhost:4000/graphql",
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           posts: {
//             keyArgs: false,
//             merge(existing, incoming) {
//               let paginatedPosts: Post[] = [];
//               if (existing && existing.paginatedPosts) {
//                 paginatedPosts = paginatedPosts.concat(existing.paginatedPosts);
//               }
//               if (incoming && incoming.paginatedPosts) {
//                 paginatedPosts = paginatedPosts.concat(incoming.paginatedPosts);
//               }
//               return { ...incoming, paginatedPosts };
//             },
//           },
//         },
//       },
//     },
//   }),
//   credentials: "include",
// });

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
