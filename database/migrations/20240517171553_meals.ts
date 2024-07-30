import { Knex } from "knex";

exports.up = async (knex: Knex): Promise<void> => {
  // Correctly define the 'types' enum type if it doesn't exist
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'types') THEN
        CREATE TYPE types AS ENUM ('meal', 'dessert', 'drink');
      END IF;
    END$$;
  `);

  // Create the 'meals' table
  return knex.schema.createTable("meals", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("desc").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.string("imageUrl");
    table.string("publicId");
    table.enu("type", null, { useNative: true, existingType: true, enumName: "types" })
      .notNullable().defaultTo("meal");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async (knex: Knex): Promise<void> => {
  // Drop the 'meals' table if it exists
  await knex.schema.dropTableIfExists('meals');

  // Drop the 'types' enum type if it exists
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'types') THEN
        DROP TYPE types;
      END IF;
    END$$;
  `);
};
