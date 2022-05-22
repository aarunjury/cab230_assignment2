// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "mysql2",
  connection: {
    host: "192.168.86.34",
    database: "volcanoes",
    user: "root",
    password: "echo4$",
  },
};
