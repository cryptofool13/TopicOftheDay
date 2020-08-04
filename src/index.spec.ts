import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import  request from 'supertest'

import {app} from './app'
import {db} from './db'
import { randomIndex, Topic } from "./utils";


const DEV_TOPICS: Topic[] = [
  {
    name: "TOD app",
    description: "finish the app you just started working on",
    timesReturned: 0,
    id: 0,
  },
  {
    name: "N-Cycle app",
    description: "finish the app you just started last month",
    timesReturned: 0,
    id: 1,
  },
  {
    name: "japanese",
    description: "read through next chapter of japanese book",
    timesReturned: 0,
    id: 2,
  },
];

db.push("/topics", DEV_TOPICS);
db.push("/deletedIndecies", []);

test("randomIndex within topics array", () => {
  const randomInd = randomIndex(db);
  expect(randomInd).toBeLessThan(DEV_TOPICS.length);
});

describe("app.ts", () => {
  it('should return list of topics at `/topics`', async() => {
    const res = await request(app).get('/topics')
    // console.log(res)
    expect(res.body).toEqual(DEV_TOPICS)
  })
})