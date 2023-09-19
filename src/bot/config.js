// @ts-check

const fs = require('fs');

const readConfig = () => {
    try {
        const rawData = fs.readFileSync('./config.json', 'utf8');
        const config = JSON.parse(rawData);

        if (
            !config.botToken ||
            !config.guildId ||
            !config.channelName ||
            typeof config.utcHourOfDay !== 'number'
        ) {
            throw new Error('Config file is missing required fields or has incorrect format');
        }

        return config;
    } catch (err) {
        console.error('Error reading or parsing config.json:', err.message);
        return null;
    }
}

module.exports = readConfig;