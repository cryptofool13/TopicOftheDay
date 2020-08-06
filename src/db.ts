import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

import { Topic } from "./utils";

let db: JsonDB;
if (process.env.NODE_ENV !== "test") {
  db = new JsonDB(new Config("topicDB", true, true, "/"));
} else {
  db = new JsonDB(new Config("TEST_topicDB", true, true, "/"));
}

const DEV_TOPICS: Topic[] = [
  {
    name: "TOD app",
    description: "finish the app you just started working on",
    timesReturned: 0,
    id: 0,
    lastReturned: new Date("08-04-2020"),
  },
  {
    name: "N-Cycle app",
    description: "finish the app you just started last month",
    timesReturned: 0,
    id: 1,
    lastReturned: new Date("08-03-2020"),
  },
  {
    name: "japanese",
    description: "read through next chapter of japanese book",
    timesReturned: 0,
    id: 2,
    lastReturned: new Date("08-02-2020"),
  },
];

db.push("/topics", DEV_TOPICS);
db.push("/deletedIndecies", []);
db.push('/topicRecord', [])

export { db };
