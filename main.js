/*
    Discord bot
*/

const Bot = require("./Bot.js")
const Discord = require('discord.js')
const messages  = require('./components/messages');

const env = require('dotenv').config().parsed;

let client = new Discord.Client();

client.on('ready', () => {

    // Image bot
    new Bot(client)

    // Implement color picker
    messages(client)

    client.on('message', message => {

        // Get help
        if (message.content === '!test') {
            message.reply('Test!')
        }

    })

});

// Login bot
client.login(env.BOT_TOKEN);

