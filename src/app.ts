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
	console.log("app.get('/topics/:id'");

	const id = req.params.id;
	try {
		const topic = req.context?.topics.getTopic(id);
		return res.json(topic);
	} catch (e) {
		return res.status(500).json({ error: 'topic does not exist' });
	}
});

app.put('/topics/:id', function (req, res) {
	const id = req.params.id;
	try {
		const topic = req.context?.topics.selectTopic(id);
		return res.json(topic);
	} catch (e) {
		return res.status(500).json({ error: 'topic does not exist' });
	}
});

app.get('/topic/rand', function (req, res) {
	// first, check topicRecord to see if there is a topic already chosen for that day, if so return topic, else get new random topic
	try {
		console.log('getting random');
		
		const topic = req.context?.topics.getRandTopic();
		console.log(topic);
		
		return res.json(topic);
	} catch (e) {
		console.log(e);

		return res.status(500).json({ error: 'somethings wrong: ' + e });
	}
});

app.get('/topics', function (req, res) {
	console.log('getting topics');
	const topics = req.context?.topics.getTopics();
	console.log(topics);

	if (!topics || !topics.length) {
		return res.status(500).json({ error: 'no topics' });
	}

	return res.json(topics);
});

app.post('/topic', function (req, res) {
	// add a single topic
	if (!req?.body?.topic?.name || !req?.body?.topic?.description) {
		return res.status(500).json({
			error:
				'must supply topic in request body in form of `{ "topic": { "name": <string>, "description": <string> } }`',
		});
	}
	const topic: { name: string; description: string } = req.body.topic;
	const newTopics = req.context?.topics.addTopic(topic);
	return res.json(newTopics);
});

app.delete('/topics/:id', function (req, res) {
	const id = req.params.id;
	try {
		const deleted = req.context?.topics.deleteTopic(id);
		return res.json(deleted);
	} catch (e) {
		return res.json({ error: e });
	}
});

export { app };
