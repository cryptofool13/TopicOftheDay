import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

import { randomIndex, Topic } from "./utils";

const db = new JsonDB(new Config("TEST_topicDB", true, true, "/"));

const DEV_TOPICS: Topic[] = [
  {
    name: "TOD app",
    description: "finish the app you just started working on",
    timesReturned: 0,
    id: 0,
  },
];

db.push("/topics", DEV_TOPICS);
db.push("/deletedIndecies", []);

test("randomIndex", () => {
  const randomInd = randomIndex(db);
  expect(randomInd).toBeLessThan(DEV_TOPICS.length);
});
