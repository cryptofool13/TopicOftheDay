// import {} from 'node-json-db'

import { JsonDB } from 'node-json-db';
import { randomIndex, TopicEvent } from '../utils';

export class Topic {
	public dataPath: {
		topics: '/topics/';
		deletedIndecies: '/deletedIndecies';
		topicRecord: '/topicRecord';
	};
	protected store!: JsonDB;
	public name!: string;
	public description!: string;
	public id!: number;
	public timesReturned!: number;
	public lastReturned?: Date | null;

	constructor({ store }: { store: JsonDB }) {
		this.store = store;
		this.dataPath = {
			topics: '/topics/',
			deletedIndecies: '/deletedIndecies',
			topicRecord: '/topicRecord',
		};
	}

	getTopics() {
		const topics = this.store.getObject<Topic[]>(this.dataPath.topics) || [];
		return topics;
	}

	getTopic(topicId: string) {
		try {
			const topic: Topic = this.store.getObject<Topic>('/topics/' + topicId);
			this.store.push(
				'/topics/' + topicId + '/timesReturned',
				topic.timesReturned + 1
			);

			return topic;
		} catch (e) {
			throw e;
		}
	}

	getRandTopic(): Topic {
		const randInd = randomIndex(this.store);
		const topic: Topic = this.store.getData(this.dataPath.topics + randInd);

		this.store.push(
			'/topics/' + randInd + '/timesReturned',
			topic.timesReturned + 1
		);
		this.store.push('/topics/' + randInd + '/lastReturned', new Date());
		const topicRecord: TopicEvent = {
			topicId: topic.id,
			timestamp: new Date(),
		};
		this.store.push('/topicRecord', [topicRecord], false);
		return topic;
	}

	addTopic(topic: { name: string; description: string }) {
		// add a single topic
		const { length }: { length: number } = this.getTopics();

		const fullTopic = {
			...topic,
			timesReturned: 0,
			id: length,
			lastReturned: null,
		};
		this.store.push('/topics/' + length, fullTopic);
		const newTopics: Topic[] = this.getTopics();
		return newTopics;
	}

	isDeleted(topicId: string): boolean {
		console.log(this.store.getData('/deletedIndecies'), topicId);

		return this.store.getData('/deletedIndecies').includes(topicId);
	}

	deleteTopic(topicId: string) {
		try {
			const toBeDeleted: Topic = this.getTopic(topicId);
			this.store.delete('/topics/' + topicId);
			this.store.push('/deletedIndecies', [topicId], false);
			return toBeDeleted;
		} catch (e) {
			throw e;
			// res.json({ error: 'topic does not exists' });
		}
	}
}
