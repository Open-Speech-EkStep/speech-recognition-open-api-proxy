
const {initializeSocketServer, listenToSocketConnections} = require('./socket_server');
const {setLanguageMap} = require('./grpc_client');
const setProxy = (server) => {
    const io = initializeSocketServer(server);
    listenToSocketConnections(io);
    setLanguageMap(`${process.env.config_base_path}/language_map.json`);
};

module.exports = setProxy;
