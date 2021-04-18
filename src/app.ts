import express from 'express';
import { json } from 'body-parser';

import { db } from './db';
import { randomIndex, TopicEvent } from './utils';
import { Topic } from './model/Topic';
import { JsonDB } from 'node-json-db';
import cors from 'cors';

const app = express();

export interface Context {
	topics: Topic;
}

app.use(json());
app.use(cors());
app.use((req, res, next) => {
	req.context = {
		topics: new Topic({ store: db }),
	};
	next();
});

app.use((req, res, next) => {
	const t = setTimeout(() => {
		next();
	}, 800);
});

app.get('/topics/:id', function (req, res) {
	const id = req.params.id;
	try {
		const topic = req.context?.topics.getTopic(id);
		res.json(topic);
	} catch (e) {
		res.status(500).json({ error: 'topic does not exist' });
	}
});

app.put('/topic/:id', function (req, res) {
	const id = req.params.id;
	try {
		const topic = req.context?.topics.selectTopic(id);
		res.json(topic);
	} catch (e) {
		res.status(500).json({ error: 'topic does not exist' });
	}
});

app.get('/topic/rand', function (req, res) {
	// first, check topicRecord to see if there is a topic already chosen for that day, if so return topic, else get new random topic
	try {
		const topic = req.context?.topics.getRandTopic();
		res.json(topic);
	} catch (e) {
		console.log(e);

		res.status(500).json({ error: 'somethings wrong: ' + e });
	}
});

app.get('/topics', function (req, res) {
	// const topics = db.getData('/topics');
	const topics = req.context?.topics.getTopics();
	if (!topics || !topics.length) {
		res.json({ error: 'no topics' });
	}

	res.json(topics);
});

app.post('/topic', function (req, res) {
	// add a single topic
	if (!req?.body?.topic?.name || !req?.body?.topic?.description) {
		return res.json({
			error:
				'must supply topic in request body in form of `{ "topic": { "name": <string>, "description": <string> } }`',
		});
	}
	const topic: { name: string; description: string } = req.body.topic;
	const newTopics = req.context?.topics.addTopic(topic);
	res.json(newTopics);
});

app.delete('/topics/:id', function (req, res) {
	const id = req.params.id;
	try {
		const deleted = req.context?.topics.deleteTopic(id);
		res.json(deleted);
	} catch (e) {
		res.json({ error: e });
	}
	// try {
	// 	const toBeDeleted: Topic = db.getData('/topics/' + id);
	// 	db.delete('/topics/' + id);
	// 	db.push('/deletedIndecies', [id], false);
	// 	res.json(toBeDeleted);
	// } catch (e) {
	// 	console.log('error: ', e);
	// 	res.json({ error: 'topic does not exists' });
	// }
});

export { app };
