-- -----------------------------------------------------
-- Table "User"
-- -----------------------------------------------------
CREATE TABLE "User" (
  "id" UUID NOT NULL,
  "email" VARCHAR(150) NOT NULL,
  "name" VARCHAR(150) NULL,
  "avatarUrl" VARCHAR(200) NULL,
  PRIMARY KEY ("id"),
  UNIQUE("email"));

-- -----------------------------------------------------
-- Table "Entry"
-- -----------------------------------------------------
CREATE TABLE "Entry" (
  "id" UUID NOT NULL,
  "url" VARCHAR(200) NULL,
  "title" VARCHAR(200) NULL,
  "originalContent" TEXT NULL,
  "creationDate" TIMESTAMP NULL,
  "publicationDate" TIMESTAMP NULL,
  "author" VARCHAR(200) NULL,
  "excerpt" TEXT NULL,
  "content" TEXT NULL,
  "imageUrl" VARCHAR(200) NULL,
  "duration" INT NULL,
  PRIMARY KEY ("id"),
  UNIQUE("url")
  );


-- -----------------------------------------------------
-- Table "Feed"
-- -----------------------------------------------------
DROP TYPE IF EXISTS "FeedType";
CREATE TYPE "FeedType" AS ENUM ('RSS');
CREATE TABLE "Feed" (
  "id" UUID NOT NULL,
  "uri" VARCHAR(200) NULL,
  "type" "FeedType" NULL,
  "creationDate" TIMESTAMP NULL,
  "lastFetchedDate" TIMESTAMP NULL,
  PRIMARY KEY ("id"),
  UNIQUE("uri"));


-- -----------------------------------------------------
-- Table "UserEntry"
-- -----------------------------------------------------
DROP TYPE IF EXISTS "UserEntryStatus";
CREATE TYPE "UserEntryStatus" AS ENUM ('NEW', 'LATER', 'FAVORITE', 'ARCHIVED');
CREATE TABLE  "UserEntry" (
  "id" UUID NOT NULL,
  "UserId" UUID NOT NULL,
  "EntryId" UUID NOT NULL,
  "creationDate" TIMESTAMP NULL,
  "lastUpdateDate" TIMESTAMP NULL,
  "progress" INT NULL,
  "status" "UserEntryStatus" NULL,
  "tags" TEXT[] NULL,
  PRIMARY KEY ("UserId", "EntryId"),
  UNIQUE("id"),
  CONSTRAINT "fk_UserEntry_User"
    FOREIGN KEY ("UserId")
    REFERENCES "User" ("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT "fk_UserEntry_Entry"
    FOREIGN KEY ("EntryId")
    REFERENCES "Entry" ("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table "UserFeed"
-- -----------------------------------------------------
CREATE TABLE  "UserFeed" (
  "id" UUID NOT NULL,
  "UserId" UUID NOT NULL,
  "FeedId" UUID NOT NULL,
  "creationDate" TIMESTAMP NULL,
  "name" TEXT NOT NULL,
  "enabled" BOOLEAN  NOT NULL DEFAULT TRUE,
  PRIMARY KEY ("UserId", "FeedId"),
  UNIQUE("id"),
  CONSTRAINT "fk_UserFeed_User"
    FOREIGN KEY ("UserId")
    REFERENCES "User" ("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT "fk_UserFeed_Feed"
    FOREIGN KEY ("FeedId")
    REFERENCES "Feed" ("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
