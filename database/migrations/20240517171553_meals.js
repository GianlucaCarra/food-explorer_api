exports.up = async knex => {
  await knex.schema.raw(`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'types') THEN
        CREATE TYPE roles AS ENUM ('meal', 'dessert', 'drink');
      END IF;
    END$$;
  `);

  return knex.schema.createTable("meals", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("desc").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.enu("type", ["meal", "dessert", "drink"], { useNative: true, enumName: "types" })
    .notNullable().defaultTo("meal");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('meals');

  await knex.schema.raw(`
    DO $$ 
    BEGIN 
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'types') THEN
        DROP TYPE types;
      END IF;
    END$$;
  `);
};
