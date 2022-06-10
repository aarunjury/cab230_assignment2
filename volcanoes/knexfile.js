// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    database: "volcanoes",
    user: "root",
    password: "Cab230!",
    dateStrings: true
  },
};
