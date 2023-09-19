// @ts-check
const { GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]});
const readConfig = require('./config')

const config = readConfig();
const BOT_TOKEN = config.botToken;
const GUILD_ID = config.guildId;
const CHANNEL_NAME = config.channelName;
const UTC_HOUR_OF_DAY = config.utcHourOfDay;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Find the correct guild and channel
    const guild = client.guilds.cache.get(GUILD_ID);
    const channel = guild.channels.cache.find(ch => ch.name === CHANNEL_NAME);

    if (!channel) {
        console.error(`Channel #${CHANNEL_NAME} not found in the provided guild!`);
        return;
    }

    // Schedule the message
    scheduleMessage(channel);
});

// Function to schedule the daily message
const scheduleMessage = (channel) => {
    const now = new Date();
    const targetTime = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), UTC_HOUR_OF_DAY, 0, 0, 0);
    if (now > targetTime) {
        targetTime.setUTCDate(targetTime.getUTCDate() + 1); // If we're past the target time today, schedule for tomorrow
    }

    const timeToWait = targetTime - now;
    setTimeout(() => {
      postMessage(channel);
    }, timeToWait);
}

// Function to post the daily growth message
const postMessage = (channel) => {
    const messageContent = "One Percent Better every day pays off lifetime dividends. \n\nDid you grow today? If you are feeling especially bold or authentic, feel free to share how you improved or grew today? If you are more shy or privacy-oriented, feel free just to answer 'yes' or 'no'.";
    channel.send(messageContent);

    // After posting today's message, schedule the next one for 24 hours later
    setTimeout(() => postMessage(channel), 24 * 60 * 60 * 1000);
}

client.login(BOT_TOKEN);
