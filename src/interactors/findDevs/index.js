const { graphql: octokit } = require('@octokit/graphql');
const searchUsers = require('./searchUsers');
const populateUsers = require('./populateUsers');
const storeCsv = require('./storeCsv');

module.exports = async ({
  query,
  locations,
  outputFile,
  githubToken,
}) => {
  const graphql = octokit.defaults({
    headers: {
      authorization: `token ${githubToken}`,
    },
  });
  const ids = await searchUsers({ graphql, locations, query });
  const users = await populateUsers({ graphql, ids });
  await storeCsv({ outputFile, users });

  return {
    found: users.length,
  };
};
