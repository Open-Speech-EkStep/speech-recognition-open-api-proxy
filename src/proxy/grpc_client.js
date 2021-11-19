const {getLanguageIpMap} = require('./language_config');
let languageIpMap = getLanguageIpMap();
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
let proto = grpc.loadPackageDefinition(packageDefinition).ekstep.speech_recognition;

class GrpcClient {
    constructor(language){
        this.language = language;
        this.client = null;
        this.stream = null;
    }

    #getGrpcIp = () => {
        let language = this.language;
        return languageIpMap[language];
    }
    
    #getGrpcClient() {
        let grpc_ip = this.#getGrpcIp();
        let grpc_client = new proto.SpeechRecognizer(
            grpc_ip,
            grpc.credentials.createInsecure()
        );
        return grpc_client;
    }

    connect(){
        this.client = this.#getGrpcClient();
    }

    getPunctuation = (msg) => {
        let meta = new grpc.Metadata();
        meta.add('language', this.language);
        return new Promise((resolve, reject) => {
            this.client.punctuate(msg,meta, (error, response) => {
                if (error) { reject(error); }
                resolve(response);
            });
        });
    }

    startStream(responseListener = () => {}, errorListener = () => {}){
        if(this.client !== null && this.client !== undefined){
            let meta = new grpc.Metadata();
            meta.add('language', this.language);
            this.stream = this.client.recognize_audio(meta)
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

module.exports = GrpcClient;