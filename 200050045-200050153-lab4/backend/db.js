const Pool = require("pg").Pool;

const fs = require('fs');

const data = fs.readFileSync('config.txt', 'utf-8');
console.log(data);
const [user_data, password_data, host_data, port_data, database_data] = data.split('\n');

const pool = new Pool({
  user: user_data,
  password: password_data,
  host: host_data,
  port: port_data,
  database: database_data
})

module.exports = pool;