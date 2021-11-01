let ip_language_map = {};
const grpc = require("grpc");
grpc.max_send_message_length = 50 * 1024 * 1024;
// grpc.max_receive_message_length = 50 * 1024 * 1024;

const PROTO_PATH =
    __dirname +
    (process.env.PROTO_PATH || "./../../audio_to_text.proto");
const protoLoader = require("@grpc/proto-loader");

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
let proto = grpc.loadPackageDefinition(packageDefinition).recognize;

const setLanguageMap = (path) => {
    ip_language_map = require(path);
};

class GrpcClient {
    constructor(language){
        this.language = language;
        this.client = null;
        this.stream = null;
    }

    #getGrpcIp = () => {
        let language = this.language;
        let grpc_ip = "localhost:55102";
        for (let ip in ip_language_map) {
            if (ip_language_map[ip].includes(language)) {
                return ip;
            }
        }
        return grpc_ip;
    }
    
    #getGrpcClient() {
        let grpc_ip = this.#getGrpcIp();
        let grpc_client = new proto.Recognize(
            grpc_ip,
            grpc.credentials.createInsecure()
        );
        return grpc_client;
    }

    connect(){
        this.client = this.#getGrpcClient();
    }

    getSrtResponse = (msg) => {
        return new Promise((resolve, reject) => {
            this.client.recognize_srt(msg, (error, response) => {
                if (error) { reject(error); }
                resolve(response);
            });
        });
    }

    getPunctuation = (msg) => {
        return new Promise((resolve, reject) => {
            this.client.punctuate(msg, (error, response) => {
                if (error) { reject(error); }
                resolve(response);
            });
        });
    }

    startStream(responseListener = () => {}, errorListener = () => {}){
        if(this.client !== null && this.client !== undefined){
            this.stream = this.client.recognize_audio()
            this.stream.on("data", responseListener);
            this.stream.on("error", errorListener);
        } else {
            console.error("grpc client not available")
        }
    }

    writeToStream(message){
        if(this.stream !== null && this.stream !== undefined)
            this.stream.write(message)
        else
            console.error("Stream not started/available")
    }

    stopStream(){
        if(this.stream !== null && this.stream !== undefined)
            this.stream.end()
        else
            console.error("Stream not started/available")
    }

    disconnect() {
        if(this.client !== null && this.client !== undefined)
            grpc.closeClient(this.client);
        else
            console.error("grpc client not available")
    }
    
}

module.exports = {setLanguageMap, GrpcClient};