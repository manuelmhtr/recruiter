const { graphql: octokit } = require('@octokit/graphql');
const fetchUsers = require('./fetchUsers');

module.exports = async ({
  query,
  githubToken,
}) => {
  const graphql = octokit.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  });
  const users = await fetchUsers({ graphql, query });
  return users;
};
