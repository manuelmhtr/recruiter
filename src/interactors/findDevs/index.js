const { graphql: octokit } = require('@octokit/graphql');
const fetchUsers = require('./fetchUsers');
const storeCsv = require('./storeCsv');

module.exports = async ({
  query,
  outputFile,
  githubToken,
}) => {
  const graphql = octokit.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  });
  const users = await fetchUsers({ graphql, query });
  await storeCsv({ outputFile, users });

  return {
    found: users.length,
  };
};
