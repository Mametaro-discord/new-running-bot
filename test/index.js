'use strict';

let { pool } = require('workerpool');
pool = pool('./worker');

pool.exec('add', [1, 1])
.then(console.log)