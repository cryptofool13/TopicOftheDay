import * as http from 'http';

import { app } from './app';

const PORT = 3001;
const HOST = 'localhost';

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`server listening at http://${HOST}:${PORT}`);
});
