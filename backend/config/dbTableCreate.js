let db = require("./db");
const { table } = require("./table");

const tableCreate = async () => {
  function createTable(query) {
    const createTableSQL = query;

    db.query(createTableSQL, (err) => {
      if (err) {
        console.error(`Error creating  table:`, err);
      } else {
        console.log(`table created successfully`);
      }
    });
  }
  table.forEach((e) => {
    const checkTableSQL = `SHOW TABLES LIKE '${e.tableName}'`;
    db.query(checkTableSQL, (err, results) => {
      if (err) {
        console.error(`Error checking ${e.tableName} table:`, err);
      } else {
        if (results.length === 0) {
          createTable(e.query);
        } else {
          console.log(`${e.tableName} table already exists`);
        }
      }
    });
  });
};
tableCreate();
