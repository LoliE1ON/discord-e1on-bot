/*
    Discord bot
*/

const Bot = require("./Bot.js")
const Discord = require('discord.js')

const env = require('dotenv').config().parsed;

let client = new Discord.Client();

client.on('ready', () => {

    // Image bot
    new Bot(client)

});

// Login bot
client.login(env.BOT_TOKEN);