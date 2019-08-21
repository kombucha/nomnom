const createPrimaryKey = table =>
  table
    .uuid("id")
    .notNullable()
    .primary();

exports.up = knex => {
  return knex.schema
    .createTable("User", table => {
      createPrimaryKey(table);

      table
        .string("email", 150)
        .unique()
        .notNullable();
      table.string("name", 150);
      table.string("avatarUrl", 200);
    })
    .createTable("Entry", table => {
      createPrimaryKey(table);

      table.string("url", 200).unique();
      table.string("title", 200);
      table.string("content", 2147483647);
      table.string("textContent", 2147483647);
      table.string("originalContent", 2147483647);
      table.string("excerpt", 2147483647);
      table.timestamp("creationDate");
      table.timestamp("publicationDate");
      table.timestamp("author");
      table.string("imageUrl", 200);
      table.integer("duration").unsigned();
      table
        .integer("wordCount")
        .defaultTo(0)
        .unsigned();
    })
    .createTable("Feed", table => {
      createPrimaryKey(table);

      table.string("uri", 200).unique();
      table.enu("type", ["RSS"], { useNative: true, enumName: "FeedType" });
      table.timestamp("creationDate");
      table.timestamp("lastUpdateDate");
      table.integer("updateFrequency").unsigned();
    })
    .createTable("UserEntry", table => {
      createPrimaryKey(table);

      table.uuid("UserId").notNullable();
      table
        .foreign("UserId")
        .references("User.id")
        .withKeyName("fk_UserEntry_User")
        .onDelete("NO ACTION")
        .onUpdate("NO ACTION");

      table.uuid("EntryId").notNullable();
      table
        .foreign("EntryId")
        .references("Entry.id")
        .withKeyName("fk_UserEntry_Entry")
        .onDelete("NO ACTION")
        .onUpdate("NO ACTION");

      table.timestamp("creationDate");
      table.timestamp("lastUpdateDate");

      table.integer("progress").unsigned();
      table.enu("status", ["NEW", "LATER", "FAVORITE", "ARCHIVED"], {
        useNative: true,
        enumName: "UserEntryStatus"
      });
      table.json("tags");
    })
    .createTable("UserFeed", table => {
      table
        .uuid("id")
        .notNullable()
        .unique();

      table.uuid("UserId").notNullable();
      table
        .foreign("UserId")
        .references("User.id")
        .withKeyName("fk_UserFeed_User")
        .onDelete("NO ACTION")
        .onUpdate("NO ACTION");

      table.uuid("FeedId").notNullable();
      table
        .foreign("FeedId")
        .references("Feed.id")
        .withKeyName("fk_UserFeed_Feed")
        .onDelete("NO ACTION")
        .onUpdate("NO ACTION");

      table.timestamp("creationDate");
      table.string("name");
      table.boolean("enabled").defaultTo(true);

      table.primary(["UserId", "FeedId"]);
    });
};

exports.down = () => {};
