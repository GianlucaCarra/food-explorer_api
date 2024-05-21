exports.up = async knex => {
  await knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.enu("role", ["admin", "user"]).notNullable().defaultTo("user");
    
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('users');
};