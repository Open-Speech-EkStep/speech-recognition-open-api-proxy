FROM node:14.14.0

EXPOSE 9009
RUN mkdir /opt/speech_recognition_open_api_proxy/
ENV base_path=/opt/speech_recognition_open_api/
ENV config_base_path=/opt/speech_recognition_open_api_proxy/deployed_models
WORKDIR /opt/speech_recognition_open_api_proxy/
COPY . /opt/speech_recognition_open_api_proxy/
RUN npm i
CMD ["npm","start"]
