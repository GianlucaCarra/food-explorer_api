exports.up = async knex => {
  await knex.schema.createTable("meals", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("desc").notNullable();
    table.string("imageUrl");
    table.string("publicId");
    table.decimal("price", 10, 2).notNullable();
    table.enu("type", ["meal", "dessert", "drink"]).notNullable().defaultTo("meal");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('meals');
};