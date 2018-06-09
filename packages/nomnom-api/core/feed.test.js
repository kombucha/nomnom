const Feed = require("./feed");
const db = require("./db");

jest.mock("./db", () => ({
  query: jest.fn(() => Promise.resolve({ rows: [] }))
}));
jest.mock("./logger");

beforeEach(() => {
  db.query.mockClear();
});

describe("Feed.createFromUri", () => {
  it("should not create a feed if it already exists", async () => {
    const fakeFeed = { id: 42 };
    db.query.mockImplementationOnce(() => ({ rows: [fakeFeed] }));

    const result = await Feed.createFromUri("http://foo.bar");

    expect(result.id).toBe(fakeFeed.id);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it("should create a feed if it doesn't already exist", async () => {
    db.query.mockImplementationOnce(() => ({ rows: [] }));

    const uri = "http://foo.bar";
    const result = await Feed.createFromUri(uri);

    expect(result).toMatchObject({
      id: expect.any(String),
      uri
    });
    expect(db.query).toHaveBeenCalledTimes(2);
  });
});

describe("Feed.updateFeedMetadata", () => {
  it("No entries result in min frequency", async () => {
    const feed = { id: 42 };
    const updateSpy = jest.spyOn(Feed, "update");

    await Feed.updateFeedMetadata(feed, []);

    expect(updateSpy).toHaveBeenCalledWith(feed.id, {
      lastUpdateDate: expect.any(Number),
      updateFrequency: Feed.MIN_FREQUENCY
    });
  });

  it("Unfrequent updates results in max frequency", async () => {
    const feed = { id: 42 };
    const entries = [
      { published: new Date("2018-06-20") },
      { published: new Date("2018-06-22") },
      { published: new Date("2018-06-24") }
    ];
    const updateSpy = jest.spyOn(Feed, "update");

    await Feed.updateFeedMetadata(feed, entries);

    expect(updateSpy).toHaveBeenCalledWith(feed.id, {
      lastUpdateDate: expect.any(Number),
      updateFrequency: Feed.MAX_FREQUENCY
    });
  });

  it("Everything in between is allowed", async () => {
    const feed = { id: 42 };
    const entries = [
      { published: new Date("2018-06-20T14:00") },
      { published: new Date("2018-06-20T16:00") },
      { published: new Date("2018-06-20T18:00") }
    ];
    const updateSpy = jest.spyOn(Feed, "update");

    await Feed.updateFeedMetadata(feed, entries);

    expect(updateSpy).toHaveBeenCalledWith(feed.id, {
      lastUpdateDate: expect.any(Number),
      updateFrequency: 2 * 3600 * 1000 // Every 2 hours
    });
  });
});
