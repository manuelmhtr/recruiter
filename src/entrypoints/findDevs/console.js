const minimist = require('minimist');
const { getGithubToken } = require('../../config');
const { findDevs } = require('../../interactors');

const parseArray = (input) => {
  const str = (input || '').trim();
  return str ? str.split(',') : [];
};

const getParams = () => {
  const argv = minimist(process.argv.slice(2));
  return {
    query: argv['q'] || argv['query'],
    locations: parseArray(argv['l'] || argv['location']),
    outputFile: argv['o'] || argv['output'],
  }
};

const execute = async () => {
  const { query, locations, outputFile } = getParams();
  const results = await findDevs({
    query,
    locations,
    outputFile,
    githubToken: getGithubToken(),
  });
  console.log(JSON.stringify(results));
};

execute();
