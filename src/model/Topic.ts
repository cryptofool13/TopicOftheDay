// import {} from 'node-json-db'

import { JsonDB } from 'node-json-db';
import { randomIndex, TopicEvent } from '../utils';

export class Topic {
	protected dataPath = {
		topics: '/topics',
		deletedIndecies: '/deletedIndecies',
		topicRecord: '/topicRecord',
	};
	protected store!: JsonDB;
	public name!: string;
	public description!: string;
	public id!: number;
	public timesReturned!: number;
	public lastReturned?: Date | null;

	constructor({ store }: { store: JsonDB }) {
		this.store = store;
	}

	getTopics() {
		const topics = this.store.getObject<Topic[]>(this.dataPath.topics);
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
		const topic: Topic = this.store.getData('/topics/' + randInd);
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
}
