"use strict";

const server = require("http").createServer();
const setProxy = require('./proxy');

setProxy(server);

const PORT = 9009;
server.listen(PORT);
console.log("Listening in port => " + PORT);
