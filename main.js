/*
    Discord bot
*/

const Bot = require("./Bot.js")
const Discord = require('discord.js')

const env = require('dotenv').config().parsed;
const channels = require("./channels.json")

let client = new Discord.Client();

for (let channel of channels.list) {
    new Bot(client, channel)
}

// Login bot
client.login(env.BOT_TOKEN);