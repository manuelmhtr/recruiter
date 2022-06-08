const minimist = require('minimist');
const { getGithubToken } = require('../../config');
const { findDevs } = require('../../interactors');

const getParams = () => {
  const argv = minimist(process.argv.slice(2));
  return {
    query: argv['q'] || argv['query'],
    outputFile: argv['o'] || argv['output'],
  }
};

const execute = async () => {
  const { query, outputFile } = getParams();
  const results = await findDevs({
    query,
    githubToken: getGithubToken(),
  });
  console.log(JSON.stringify(results));
};

execute();
