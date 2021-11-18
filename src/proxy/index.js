
const {initializeSocketServer, listenToSocketConnections} = require('./socket_server');


const setProxy = (server) => {
    const io = initializeSocketServer(server);
    listenToSocketConnections(io);    
};

module.exports = setProxy;
