-- -----------------------------------------------------
-- Table "Feed"
-- -----------------------------------------------------

ALTER TABLE "Feed"
DROP COLUMN "lastFetchedDate",
ADD COLUMN "lastUpdateDate" TIMESTAMP NULL,
ADD COLUMN "updateFrequency" INT NULL;
