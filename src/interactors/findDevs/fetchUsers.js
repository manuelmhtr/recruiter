const parseUser = require('./parseUser');

const fetchUsers = async ({ graphql, ids }) => {
  const { nodes } = await graphql(`
    query($ids: [ID!]!) {
      nodes(ids: $ids) {
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
  `, { ids });
  return nodes.map(parseUser);
};

module.exports = ({ graphql, ids }) => fetchUsers({ graphql, ids });
