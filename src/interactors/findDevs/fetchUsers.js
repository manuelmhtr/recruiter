const parseUser = require('./parseUser');

const PAGE_SIZE = 5;
const LIMIT = 10;

const fetchPage = async ({ graphql, query, cursor = null }) => {
  const { search } = await graphql(`
    query {
      search(type: USER, query:"${query} sort:followers-desc", first:${PAGE_SIZE}, after:${cursor}) {
        edges {
          node {
            __typename
            ... on User {
              avatarUrl(size: 72)
              bio
              company
              createdAt
              email
              isGitHubStar
              isHireable
              location
              login
              monthlyEstimatedSponsorsIncomeInCents
              name
              websiteUrl
              status {
                emoji
                message
              }
              twitterUsername
              followers {
                totalCount
              }
              following {
                totalCount
              }
              issueComments {
                totalCount
              }
              organizations {
                totalCount
              }
              packages {
                totalCount
              }
              pinnedItems {
                totalCount
              }
              pullRequests {
                totalCount
              }
              repositories {
                totalCount
                totalDiskUsage
              }
              repositoriesContributedTo {
                totalCount
              }
              repositoryDiscussionComments {
                totalCount
              }
              sponsors {
                totalCount
              }
              starredRepositories {
                totalCount
              }
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                }
                restrictedContributionsCount
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `);
  const users = (search.edges || []).map(parseUser);
  const nextCursor = search.pageInfo.hasNextPage ? `"${search.pageInfo.endCursor}"` : null;

  return { users, nextCursor };
};

module.exports = async ({ graphql, query }) => {
  let results = [];
  let cursor = null;

  do {
    const { users, nextCursor } = await fetchPage({ graphql, query, cursor });
    results = results.concat(users);
    cursor = nextCursor;
  } while (cursor && results.length < LIMIT);

  return results;
};
