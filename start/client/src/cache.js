import { InMemoryCache, Reference, makeVar } from '@apollo/client';

//Apollo Client stores your query results in its in-memory cache.
//The cache handles most operations intelligently and efficiently,
//but it doesn't automatically know that we want to merge our two distinct lists of launches.
//To fix this, we'll define a merge function for the paginated field in our schema.
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
        cartItems: {
          read() {
            return cartItemsVar();
          },
        },
        launches: {
          keyArgs: false,
          merge(existing, incoming) {
            let launches = [];
            if (existing && existing.launches) {
              launches = launches.concat(existing.launches);
            }
            if (incoming && incoming.launches) {
              launches = launches.concat(incoming.launches);
            }
            return {
              ...incoming,
              launches,
            };
          },
        },
      },
    },
  },
});

// Initializes to true if localStorage includes a 'token' key,
// false otherwise
export const isLoggedInVar = makeVar(!!localStorage.getItem('token'));

// Initializes to an empty array
export const cartItemsVar = makeVar([]);
