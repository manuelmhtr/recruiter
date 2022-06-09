const { chunk } = require('lodash');
const fetchUsers = require('./fetchUsers');

const CHUNK_SIZE = 10;

module.exports = ({ graphql, ids: allIds }) => {
  const chunks = chunk(allIds, CHUNK_SIZE);
  return chunks.reduce(async (promise, ids) => {
    const prev = await promise;
    const users = await fetchUsers({ graphql, ids });

    console.log(`Populated ${users.length} users...`);

    return prev.concat(users);
  }, Promise.resolve([]));
};
