import * as express from "express";
import * as bodyParser from "body-parser";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import * as http from "http";

import { Topic, randomIndex } from "./utils";

const app = express();

const db = new JsonDB(new Config("topicDB", true, true, "/"));

app.use(bodyParser.json());

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

app.get("/topics/:id", function (req: express.Request, res: express.Response) {
  const id = req.params.id;
  try {
    const topic: Topic = db.getData("/topics/" + id);
    db.push("/topics/" + id + "/timesReturned", topic.timesReturned + 1);
    res.json(topic);
  } catch (e) {
    console.log("error: ", e);
    res.json({ error: "topic does not exist" });
  }
});

app.get("/topic/rand", function (req: express.Request, res: express.Response) {
  const randInd = randomIndex(db);
  const topic: Topic = db.getData("/topics/" + randInd);
  db.push("/topics/" + randInd + "/timesReturned", topic.timesReturned + 1);
  res.json(topic);
});

app.get("/topics", function (req: express.Request, res: express.Response) {
  const topics = db.getData("/topics");
  res.json(topics);
});

app.post("/topic", function (req: express.Request, res: express.Response) {
  // add a single topic
  const { length }: { length: number } = db.getData("/topics");
  if (
    !req.body ||
    !req.body.topic ||
    !req.body.topic.name ||
    !req.body.topic.description
  ) {
    return res.json({
      error:
        'must supply topic in request body in form of `{ "topic": { "name": <string>, "description": <string> } }`',
    });
  }
  const topic: Topic = { ...req.body.topic, timesReturned: 0, id: length };
  db.push("/topics/" + length, topic);
  const newTopics: Topic[] = db.getData("/topics");
  res.json(newTopics);
});

app.delete("/topics/:id", function (
  req: express.Request,
  res: express.Response
) {
  const id = req.params.id;
  try {
    const toBeDeleted: Topic = db.getData("/topics/" + id);
    db.delete("/topics/" + id);
    db.push("/deletedIndecies", [id], false);
    res.json(toBeDeleted);
  } catch (e) {
    console.log("error: ", e);
    res.json({ error: "topic does not exists" });
  }
});

const PORT = 3000;
const HOST = "localhost";

const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`server listening at http://${HOST}:${PORT}`);
});
