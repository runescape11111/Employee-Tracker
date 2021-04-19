const DB = require('./db');
const CLI = require('./lib/cli');

const db = new DB();
const cli = new CLI(db);
cli.start();