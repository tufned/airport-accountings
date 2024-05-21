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

  let valuesStr = '';
  Object.values(data).forEach(elem => {
    if (isNaN(elem) && typeof elem === 'string') valuesStr += `'${elem}',`;
    else if (!isNaN(elem)) valuesStr += elem;
  });

  try {
    const result = await TableModel.createRecord(req.name, Object.keys(data), valuesStr);
    res.status(201).json(successObj(result));

  } catch (err) {
    next({errorMsg: err.message, statusCode: 500});
  }
}


exports.updateRecord = async (req, res, next) => {
  const data = req.body;

  let valuesStr = '';
  Object.keys(data).forEach(key => {
    if (key === 'id') return;

    if (isNaN(data[key]) && typeof data[key] === 'string') valuesStr += `${key}='${data[key]}', `;
    else if (!isNaN(data[key])) valuesStr += `${key}=${data[key]}, `;
  });
  valuesStr = valuesStr.trim().slice(0, -1);

  try {
    const result = await TableModel.updateRecord(req.name, valuesStr, data.id);
    res.status(201).json(successObj(result));

  } catch (err) {
    next({errorMsg: err.message, statusCode: 500});
  }
}


exports.errorHandler = (err, req, res, next) => {
  console.error(err.error);
  res.status(err.statusCode).json(failObj(err.errorMsg));
}