const db = require('./db');

const dbName = process.env.DB_NAME;

class TableModel {

  static #runQuery(query) {
      return db.execute(query)
  }

  static async getTablesNames() {
    const allTables = (await TableModel.#runQuery('SHOW FULL TABLES'))[0];
    const tablesNames = [];
    for (let elem of allTables) {
      if (elem.Table_type !== "VIEW") tablesNames.push(elem[`Tables_in_${dbName}`]);
    }
    return tablesNames;
  }

  static async getTable(tableName) {
    return TableModel.#runQuery(`SELECT * FROM ${dbName}.${tableName}`);
  }

  static async createRecord(tableName, keys, values) {
    console.log(`INSERT INTO ${dbName}.${tableName} (${keys}) VALUES (${values})`);
    return TableModel.#runQuery(`INSERT INTO ${dbName}.${tableName} (${keys}) VALUES (${values})`);
  }

  static async updateRecord(tableName, valuesStr, id) {
    console.log(`UPDATE ${dbName}.${tableName} SET ${valuesStr} WHERE id = ${id}`);
    return TableModel.#runQuery(`UPDATE ${dbName}.${tableName} SET ${valuesStr} WHERE id = ${id}`);
  }
}

module.exports = TableModel;