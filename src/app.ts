import express from "express";
import bodyParser from "body-parser";

import { db } from "./db";
import { Topic, randomIndex, TopicEvent } from "./utils";

const app = express();

app.use(bodyParser.json());

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
  // first, check topicRecord to see if there is a topic already chosen for that day, if so return topic, else get new random topic
  const randInd = randomIndex(db);
  const topic: Topic = db.getData("/topics/" + randInd);
  db.push("/topics/" + randInd + "/timesReturned", topic.timesReturned + 1);
  db.push("/topics/" + randInd + "/lastReturned", new Date());
  const topicRecord: TopicEvent = { topic: topic.id, timestamp: new Date() };
  db.push("/topicRecord", [topicRecord], false);
  res.json(topic);
});

app.get("/topics", function (req: express.Request, res: express.Response) {
  const topics = db.getData("/topics");
  res.json(topics);
});

app.post("/topic", function (req: express.Request, res: express.Response) {
  // add a single topic
  const { length }: { length: number } = db.getData("/topics");
  if (!req?.body?.topic?.name || !req?.body?.topic?.description) {
    return res.json({
      error:
        'must supply topic in request body in form of `{ "topic": { "name": <string>, "description": <string> } }`',
    });
  }
  const topic: Topic = {
    ...req.body.topic,
    timesReturned: 0,
    id: length,
    lastReturned: null,
  };
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

export { app };
