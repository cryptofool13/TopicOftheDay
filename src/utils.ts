import { JsonDB } from "node-json-db";

export function randomIndex(db: JsonDB) {
  const topics: Topic[] = db.getData("/topics");
  const deleted: string[] = db.getData("/deletedIndecies");
  const { length } = topics;
  let randomInd = Math.floor(Math.random() * length);
  if (deleted.length === length) {
    throw new Error("No available topics");
  }
  while (deleted.includes(String(randomInd))) {
    randomInd = Math.floor(Math.random() * length);
  }
  return randomInd
}

export interface Topic {
  name: string;
  description: string;
  id: number;
  timesReturned: number;
}
