## Proxy for Open Speech API

This project is a proxy to provide support for real-time streaming functionality for Open Speech API https://open-speech-ekstep.github.io/ from browsers or any clients that doesn't support gprc bi-directional streaming.

### How to use it

**Step 1: Install the package**

`npm i `

**Step 2: Configure model hosted address its respective languages**
- Add model hosted address in language_map.json file in the project root.
- Example: 
```
{
    "<ip-address/domain>:<port>": [
        "hi",
        "en"
    ],
    "<ip-address/domain>:<port>": [
        "ta",
        "te"
    ],
}
```

**Step 3: Run**
```
npm start
```


This service url can be used in [speech-recognition-open-api-client](https://github.com/Open-Speech-EkStep/speech-recognition-open-api-client)


