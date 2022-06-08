const parseUser = require('./parseUser');

const PAGE_SIZE = 30;
const LIMIT = 1000;

const fetchPage = async ({ graphql, query, cursor = null, retries = 0 }) => {
  const { search } = await graphql(`
    query {
      search(type: USER, query:"${query}", first:${PAGE_SIZE}, after:${cursor}) {
        edges {
          node {
            __typename
            ... on User {
              login
              name
              url
              email
              websiteUrl
              bio
              company
              location
              status {
                emoji
                message
              }
              createdAt
              avatarUrl(size: 72)
              isGitHubStar
              isHireable
              monthlyEstimatedSponsorsIncomeInCents
              twitterUsername
              followers {
                totalCount
              }
              following {
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
                totalRepositoryContributions
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
                totalPullRequestReviewContributions
                totalRepositoriesWithContributedCommits
                totalRepositoriesWithContributedPullRequests
                totalRepositoriesWithContributedPullRequestReviews
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
  `).catch((error) => {
    console.log(`Error fetching ${cursor} page. Retries: ${retries}`);
    if (retries >= 3) throw error;
    return fetchPage({ graphql, query, cursor, retries: retries + 1 });
  });
  const users = (search.edges || []).map(parseUser);
  const nextCursor = search.pageInfo.hasNextPage ? `"${search.pageInfo.endCursor}"` : null;

  return { users, nextCursor };
};

module.exports = async ({ graphql, query }) => {
  let results = [];
  let cursor = null;

  do {
    const { users, nextCursor } = await fetchPage({ graphql, query, cursor });
    console.log(`Found ${users.length} users...`);
    results = results.concat(users);
    cursor = nextCursor;
  } while (cursor && results.length < LIMIT);

  return results;
};
