const path = require('path');
const ip_language_config = require(path.join(process.env.config_base_path || process.cwd(), "language_map.json"));

const getClusterConnectionCountMap = () => {
    let clusterConnectionCountMap = {};
    for (let [ip, config] of Object.entries(ip_language_config)) {
        clusterConnectionCountMap[ip] = config["maxConnectionCount"];
    }
    return clusterConnectionCountMap;
};

const getLanguageIpMap = () => {
    let language_ip_map = {};
    for (let [ip, config] of Object.entries(ip_language_config)) {
        const languages = config["languages"];
        for (let index in languages) {
            const language = languages[index];
            language_ip_map[language] = ip;
        }
    }
    return language_ip_map;
};

const getLanguages = () => {
    let languages = [];
    for (let [ip, config] of Object.entries(ip_language_config)) {
        const languagesList = config["languages"];
        languages = languages.concat(languagesList);
    }
    return languages;
}

module.exports = {
    getLanguageIpMap,
    getClusterConnectionCountMap,
    getLanguages
}