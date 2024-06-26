const TableModel = require('../models/tableModel');
const { successObj, failObj } = require('../helpers');

exports.getAllTables = async (req, res, next) => {
  try {
    const tables = await TableModel.getTablesNames();
    res.status(200).json(successObj(tables));

  } catch (err) {
    next({errorMsg: err.message, statusCode: 500});
  }
}


exports.checkTableName = async (req, res, next, name) => {
  const tables = await TableModel.getTablesNames();

  if (!tables.includes(name)) return next({
    errorMsg: "Table not found",
    statusCode: 404
  });

  req.name = name;
  next();
}


exports.getTable = async (req, res, next) => {
  try {
    const data = (await TableModel.getTable(req.name))[0];
    res.status(200).json(successObj(data));

  } catch (err) {
    next({errorMsg: err.message, statusCode: 500});
  }
}


exports.createRecord = async (req, res, next) => {
  const data = req.body;

  const valuesArr = [];
  Object.values(data).forEach(elem => {
    if (isNaN(elem) && typeof elem === 'string') valuesArr.push(`'${elem}'`);
    else if (!isNaN(elem)) valuesArr.push(elem);
  });

  try {
    const result = await TableModel.createRecord(req.name, Object.keys(data), valuesArr.join(','));
    res.status(201).json(successObj(result));

  } catch (err) {
    next({errorMsg: err.message, statusCode: 500});
  }
}



exports.checkRecordId = (req, res, next, recordId) => {

  if (isNaN(recordId) && typeof recordId === 'string') recordId = `'${recordId}'`;

  if (!recordId || recordId?.length === 0) return next({
    errorMsg: "Invalid ID",
    statusCode: 404
  });

  req.recordId = recordId;
  next();
}


exports.updateRecord = async (req, res, next) => {
  const data = req.body;
  const id = req.recordId;

  const valuesArr = [];
  Object.keys(data).forEach(key => {
    if (key === 'id') return;

    if (isNaN(data[key]) && typeof data[key] === 'string') valuesArr.push(`${key}='${data[key]}'`);
    else if (!isNaN(data[key])) valuesArr.push(`${key}=${data[key]}`);
  });

  try {
    const result = await TableModel.updateRecord(req.name, valuesArr.join(','), id);
    res.status(201).json(successObj(result));

  } catch (err) {
    next({errorMsg: err.message, statusCode: 500});
  }
}


exports.deleteRecord = async (req, res, next) => {
  const id = req.recordId;

  try {
    const result = await TableModel.deleteRecord(req.name, id);
    res.status(200).json(successObj(result));

  } catch (err) {
    next({errorMsg: err.message, statusCode: 500});
  }
}


exports.errorHandler = (err, req, res, next) => {
  console.error(err.error);
  res.status(err.statusCode).json(failObj(err.errorMsg));
}