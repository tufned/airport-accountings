const express = require('express');
const {
	getTable,
	checkTableName,
	getAllTables,
	errorHandler,
	createRecord,
	updateRecord,
	deleteRecord,
	checkRecordId
} = require('../controllers/tableController');
const TableModel = require("../models/tableModel");

const router = express.Router();

router.get('/all', getAllTables);

router.param('name', checkTableName);
router.route('/:name')
	.get(getTable)
	.post(createRecord);

router.param('recordId', checkRecordId);
router.route('/:name/:recordId')
	.put(updateRecord)
	.delete(deleteRecord);

router.use(errorHandler);

module.exports = router;