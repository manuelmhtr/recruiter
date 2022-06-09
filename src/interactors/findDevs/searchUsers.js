const { uniq } = require('lodash');

const PAGE_SIZE = 100;
const LIMIT = 10000;

const parseResult = ({ node }) => node.id;

const fetchPage = async ({ graphql, query, cursor = null, retries = 0 }) => {
  const variables = { q: query, cursor, first: PAGE_SIZE };
  const { search } = await graphql(`
    query($q: String!, $cursor: String, $first: Int!) {
      search(type: USER, query:$q, first:$first, after:$cursor) {
        edges {
          node {
            __typename
            ... on User {
              id
              login
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }`,
    variables,
  ).catch((error) => {
    console.log(`Error fetching ${cursor} page. Retries: ${retries}`);
    if (retries >= 3) throw error;
    return fetchPage({ graphql, query, cursor, retries: retries + 1 });
  });
  const ids = (search?.edges || []).map(parseResult);
  const nextCursor = search?.pageInfo?.hasNextPage ? search.pageInfo.endCursor : null;

  return { ids, nextCursor };
};

const fetchAll = async ({ graphql, query }) => {
  let results = [];
  let cursor = null;

  try {
    do {
      const { ids, nextCursor } = await fetchPage({ graphql, query, cursor });
      console.log(`Found ${ids.length} users...`);
      results = results.concat(ids);
      cursor = nextCursor;
    } while (cursor && results.length < LIMIT);
  } catch(error) {
    console.log('Data fetching failed. Returning partial results...');
    console.log(error);
  } finally {
    return results;
  }
};

module.exports = async ({ graphql, locations, query }) => {
  return (locations || []).reduce(async (promise, location) => {
    const prev = await promise;
    const fullQuery = location ? `location:${location} ${query}` : query;
    const ids = await fetchAll({ graphql, query: fullQuery });
    console.log(`Got ${ids.length} results for "${fullQuery}"`);
    return uniq(prev.concat(ids))
  }, Promise.resolve([]));
};
