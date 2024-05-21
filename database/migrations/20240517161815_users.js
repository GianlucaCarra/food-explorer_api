exports.up = async knex => {
  await knex.schema.raw(`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
        CREATE TYPE roles AS ENUM ('admin', 'user');
      END IF;
    END$$;
  `);

  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.enu("role", ["admin", "user"], { useNative: true, enumName: "roles" })
    .notNullable().defaultTo("user");

    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('users');

  await knex.schema.raw(`
    DO $$ 
    BEGIN 
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
        DROP TYPE roles;
      END IF;
    END$$;
  `);
};
