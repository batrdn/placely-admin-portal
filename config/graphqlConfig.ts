import {createHttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';

const link = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

export const client = new ApolloClient<any>({
  cache: new InMemoryCache(),
  link,
});
