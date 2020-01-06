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

    client.on('message', message => {

        // Get help
        if (message.content === '!test') {
            message.reply('Test!')
        }

    })

    client.on('guildMemberAdd', member => {
        const guild = client.guilds.get("509065700401348630");
        const role = guild.roles.find("name", "Member");
        member.addRole(role.id);
    });

});

// Login bot
client.login(env.BOT_TOKEN);

