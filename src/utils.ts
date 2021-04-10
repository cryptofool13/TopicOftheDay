import { JsonDB } from "node-json-db";

export function randomIndex(db: JsonDB) {
  const topics: Topic[] = db.getData("/topics");
  const length = topics.length;
  let randInd = Math.floor(Math.random() * length);
  while (db.getData("/topics/" + randInd) === null) {
    randInd = Math.floor(Math.random() * length);
  }
  return randInd;
}

export interface TopicEvent {
  topic: number;
  timestamp: Date;
}

export interface Topic {
  name: string;
  description: string;
  id: number;
  timesReturned: number;
  lastReturned?: Date | null;
}
