const express = require('express');
const cors = require('cors');
const {exec} = require('node:child_process');
const tablesRouter = require('./routes/tableRouter');

const dbUser = process.env.DB_USER;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;

const app = express();
const corsConfig = {
  origin: 'http://localhost:3007'
}

app.use(cors(corsConfig));
app.use(express.json());

app.use('/table', tablesRouter);

app.get('/reset', (req, res) => {
  exec(`mysql -u ${dbUser} -p${dbPassword} ${dbName} < ../databases/schema.sql`, (err, stdout, stderr) => {
    if (err) return console.error(stderr);

    console.log(stdout);
    console.error(stderr);
    res.status(200).json({status: 'success'});
  });
});


module.exports = app;