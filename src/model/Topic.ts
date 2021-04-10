// import {} from 'node-json-db'

import { JsonDB } from 'node-json-db';

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
}
