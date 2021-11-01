// var ss = require('socket.io-stream');
// ss.forceBase64 = true;
const MAX_SOCKET_CONNECTIONS = process.env.MAX_CONNECTIONS || 80;
const {GrpcClient} = require('./grpc_client');
const idDict = {};


const initializeSocketServer = (server) => {
    return require("socket.io")(server, {
        cors: {
            origin: "*"
        }
    });
}

const listenToSocketConnections = (io) => {

    function respondToUserSocket(user, action, response="", language=""){
        io.to(user).emit(action, response, language);
    }

    function onResponse(response) {
        const data = JSON.parse(response.transcription);
        const id = data["id"];
        const user = response.user;
        if (idDict[user] && idDict[user] === id) {
            return;
        } else {
            idDict[user] = id;
        }
        if (!data["success"]) {
            return;
        }
        if (response.action === "terminate") {
            respondToUserSocket(response.user, "terminate");
        } else {
            respondToUserSocket(response.user, "response", data["transcription"], response.language)
        }
    }
    
    function onUserConnected(socket, grpcClient) {
        function onError(err){
            console.log("GRPC Error", err);
        }
        grpcClient.startStream(onResponse, onError);
        respondToUserSocket(socket.id, "connect-success");
    }

    function make_message(audio, user, speaking, language = 'en', isEnd) {
        const msg = {
            audio: audio,
            user: user + "",
            language: language,
            speaking: speaking,
            isEnd: isEnd
        };
        return msg;
    }
    function make_file_message(audio, user, language = 'en', fileName) {
        const msg = {
            audio: audio,
            user: user + "",
            language: language,
            filename: fileName
        };
        return msg;
    }

    io.on("connection", (socket) => {

        let grpcClient = new GrpcClient(socket.handshake.query.language);
        grpcClient.connect();

        socket.on("disconnect", (reason) => {
            grpcClient.stopStream()
            grpcClient.disconnect()
            console.log(socket.id, "got disconnected", reason);
        });
    
        const numUsers = socket.client.conn.server.clientsCount;
        console.log("Number of users => ", numUsers);
        if (numUsers > MAX_SOCKET_CONNECTIONS) {
            socket.emit("abort");
            socket.disconnect();
            return;
        }
    
        socket.on('connect_mic_stream', () => {
            onUserConnected(socket, grpcClient);
            socket.on("mic_data", function (chunk, language, speaking, isEnd) {
                let user = socket.id;
                let message = make_message(chunk, user, speaking, language, isEnd);
                grpcClient.writeToStream(message)
            });
        });
    
        // socket.on('connect_file_stream', () => {
        //     console.log("CONNECT FILE STREAM CALLED");
        //     userCalls[socket.id] = grpcClient.recognize_audio_file_mode();
        //     userCalls[socket.id].on("data", (response) => {
        //         const data = JSON.parse(response.transcription);
        //         io.to(response.user).emit("file_upload_response", data["transcription"], response.language);
        //         userCalls[socket.id].end();
        //     });
        //     ss(socket).on("file_data", function (fileStream, data) {
        //         let language = data.language;
        //         let fileName = data.name;
        //         console.log("called here", language, fileName);
        //         fileStream.on('data', function (chunk) {
        //             console.log("called file data");
        //             let user = socket.id;
        //             let message = make_file_message(chunk, user, language, fileName);
        //             userCalls[socket.id].write(message);
        //         });
        //         fileStream.on('error', console.log);
        //         fileStream.on('end', () => {
        //             console.log("ended");
        //         })
        //     });
        //     io.to(socket.id).emit("connect-success", "");
        // });
    });
}

module.exports = {initializeSocketServer, listenToSocketConnections};