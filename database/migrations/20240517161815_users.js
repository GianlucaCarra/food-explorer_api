exports.up = async knex => {
  // Create the 'roles' type if it doesn't exist
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
        CREATE TYPE roles AS ENUM ('admin', 'user');
      END IF;
    END$$;
  `);

  // Create the 'users' table
  await knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.enu("role", null, { useNative: true, existingType: true, enumName: "roles" })
      .notNullable().defaultTo("user");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async knex => {
  // Drop the 'users' table if it exists
  await knex.schema.dropTableIfExists('users');

  // Drop the 'roles' type if it exists
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
        DROP TYPE roles;
      END IF;
    END$$;
  `);
};
