exports.up = knex => knex.schema.createTable("orders", table => {
  table.increments("id").primary();
  table.integer("user_id").references("id").inTable("users");

  table.timestamp("created_at").defaultTo(knex.fn.now());
});

exports.down =  knex => knex.schema.dropTableIfExists('orders');
