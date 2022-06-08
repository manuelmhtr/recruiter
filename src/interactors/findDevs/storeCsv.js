const fs = require('fs');
const { stringify } = require('csv-stringify/sync');

module.exports = ({ outputFile, users }) => {
  const columns = Object.keys(users[0] || {});
  const csv = stringify(users, { columns });
  fs.writeFileSync(outputFile, csv);
};