/** Database for lunchly */

const pg = require("pg");

const db = new pg.Client("postgresql://suong:123456789@localhost:5432/lunchly");

db.connect();

module.exports = db;
