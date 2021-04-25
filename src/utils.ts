import { JsonDB } from 'node-json-db';

export function randomIndex(db: JsonDB) {
	const topics = db.getObject<Topic[]>('/topics');
	const deletedIdx = db.getObject<number[]>('/deletedIndecies');
	if (topics.length === deletedIdx.length) {
		throw Error('no topics');
	}
	const length = topics.length;
	let randInd = Math.floor(Math.random() * length);
	while (db.getData('/deletedIndecies').includes(randInd.toString())) {
		randInd = Math.floor(Math.random() * length);
	}

	return randInd;
}

export interface TopicEvent {
	topicId: number;
	timestamp: Date;
}

export interface Topic {
	name: string;
	description: string;
	id: number;
	timesReturned: number;
	lastReturned?: Date | null;
}
