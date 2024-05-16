const express = require('express');
const { getTable, checkTableName, getAllTables, errorHandler} = require('../controllers/tableController');
const TableModel = require("../models/tableModel");

const router = express.Router();

router.get('/all', getAllTables);

router.param('name', checkTableName);
router.route('/:name')
  .get(getTable);

router.use(errorHandler);

module.exports = router;