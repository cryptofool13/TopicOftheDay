import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import request from 'supertest';

import { app } from './app';
import { db } from './db';
import { randomIndex, Topic } from './utils';

const DEV_TOPICS: Topic[] = [
	{
		name: 'TOD app',
		description: 'finish the app you just started working on',
		timesReturned: 0,
		id: 0,
	},
	{
		name: 'N-Cycle app',
		description: 'finish the app you just started last month',
		timesReturned: 0,
		id: 1,
	},
	{
		name: 'japanese',
		description: 'read through next chapter of japanese book',
		timesReturned: 0,
		id: 2,
	},
];

db.push('/topics', DEV_TOPICS);
db.push('/deletedIndecies', []);

test('randomIndex within topics array', () => {
	const randomInd = randomIndex(db);
	expect(randomInd).toBeLessThan(DEV_TOPICS.length);
});

describe('app.ts', () => {
	it('should return list of topics at `/topics`', async () => {
		const res = await request(app).get('/topics');
		expect(res.body).toEqual(DEV_TOPICS);
	});
	it('should return a specific topic', async () => {
		const res = await request(app).get('/topics/0');
		expect(res.body).toEqual(DEV_TOPICS[0]);
	});
	it('should add a new topic', async () => {
		const newTopic = {
			name: 'a new topic',
			description: 'new topic description',
		};
		const res = await request(app).post('/topic').send({ topic: newTopic });
		expect(res.body).toHaveLength(4);
	});
	it('should delete a topic', async () => {
		const res = await request(app).delete('/topics/3');
		expect(res.body).not.toHaveProperty('error');
		const otherTopics = await request(app).get('/topics');
		expect(otherTopics.body[3]).toBeNull();
	});
	it('should return a random topic', async () => {
		const res = await request(app).get('/topic/rand');
		expect(res.body).toHaveProperty('name');
		expect(res.body).toHaveProperty('description');
		expect(res.body).toHaveProperty('timesReturned');
	});

	it('should increment `timesReturned` after selecting topic', async () => {
		const res = await request(app).put('/topic/1');
		expect(res.body).toHaveProperty('timesReturned');
		expect(res.body.timesReturned).toBe(1);
	});
});
