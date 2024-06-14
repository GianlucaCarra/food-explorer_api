exports.up = knex => knex.schema.createTable("ingredients", table => {
    table.increments("id").primary();
    table.integer("meal_id").references("id").inTable("meals").onDelete('CASCADE');
    table.string("name").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

exports.down =  knex => knex.schema.dropTableIfExists('ingredients');
