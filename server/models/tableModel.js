const db = require('./db');

class TableModel {

  static #runQuery(query) {
      return db.execute(query)
  }

  static async getTablesNames() {
    const allTables = (await TableModel.#runQuery('SHOW TABLES'))[0];
    const tablesNames = allTables.map(elem => Object.values(elem)[0])
    return tablesNames;
  }

  static async getTable(tableName) {
    return TableModel.#runQuery(`SELECT * FROM cursova_db.${tableName}`);
  }
}

module.exports = TableModel;