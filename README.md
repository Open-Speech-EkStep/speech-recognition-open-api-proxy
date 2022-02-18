# Proxy for Open Speech API

This project is a proxy to provide support for real-time streaming functionality for Open Speech API https://open-speech-ekstep.github.io/ from browsers or any clients that doesn't support gprc bi-directional streaming.

## Table of Contents

* [Getting Started](#getting-Started)
* [Getting Help](#getting-help)

## Getting Started

### Step 1: Install the package

```nodejs
npm i 
```

### Step 2: Configure model hosted address its respective languages

* Add model hosted address in language_map.json file in the project root.
    Example:

    ```json
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

* Set the folder path of language_map.json as env variable: `config_base_path="<project_root_folder_path>"` (eg: /users/node/speech-recognition-open-api-proxy)

### Step 3: Run

```nodejs
npm start
```

This service url can be used in [speech-recognition-open-api-client](https://github.com/Open-Speech-EkStep/speech-recognition-open-api-client)

## Note

1. Port of the service can be changed using `PORT` environment variable.

## Getting Help

The best way to interact with our team is through GitHub. Please open an issue in github.
