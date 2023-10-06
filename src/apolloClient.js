import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
// import Cookies from "js-cookie";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
// import { split } from "apollo-link";
import { SERVER_URL, SUBSCRIPTION_URL } from './const';

const httpLink = createHttpLink({
  uri: `${SERVER_URL}/graphql`,
  credentials: "include",
});
const token = localStorage.getItem("token");
const wsLink = new WebSocketLink({
  uri: SUBSCRIPTION_URL,
    options:
    {
      reconnect: true,
      lazy: true,
      connectionParams: {
        authorization: token ? `Bearer ${token}` : "",
      },
    },
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});


var httpLinkToken = authLink.concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinkToken
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    addTypename: false
  }),
});

export { client };
