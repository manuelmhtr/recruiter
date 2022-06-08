require('dotenv').config();

const getGithubToken = () => process.env.GITHUB_TOKEN;

module.exports = {
  getGithubToken,
};
