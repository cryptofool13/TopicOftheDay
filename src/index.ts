import * as http from "http";

import { app } from "./app";

const PORT = 3000;
const HOST = "localhost";

const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`server listening at http://${HOST}:${PORT}`);
});
