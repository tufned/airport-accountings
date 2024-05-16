const TableModel = require('../models/tableModel');
const { successObj, failObj} = require('../helpers');

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


exports.errorHandler = (err, req, res, next) => {
  console.error(err.error);
  res.status(err.statusCode).json(failObj(err.errorMsg));
}