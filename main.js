// Libraries
const _env = require('dotenv').config().parsed;
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('cron');
const Discord = require('discord.js');

// Client
let client = new Discord.Client();

// Channel IDs
let channels = [
    "634741083284439040", // LoliChat
    "634652026172866561" // Loli Library
];

// Fetch image
async function getImage() {

    try {

        // Request
        let res = await axios({
            url: 'http://anime.reactor.cc/random',
            method: 'get',
            timeout: 8000,
        });

        // Html root
        const $ = cheerio.load(res.data);

        // Image
        let image;

        // Parse html
        $('div.post_content,allow_long > div.image > a.prettyPhotoLink').each((i, elem) => {

                let $img = $(elem).find('img');
                if ($img.attr('src') !== "//css.reactor.cc/images/unsafe_ru.gif") {
                    image = $img.attr('src');
                }

        });

       return image;

    }
    catch (err) {
        console.error(err);
    }

}

// Cron
// Request message every 10 min
let cronJob = new cron.CronJob('*/30 * * * *', () => {

    channels.forEach((channel) => {

        // Fetch image
        getImage().then(image => {

            if (image !== undefined) {

                // Channel id
                let discordChannel = client.channels.get(channel);

                // Send message
                discordChannel.send("", {files: [image]});

            }

        });

    });

});

// Bot ready
client.on('ready', () => {
    // Start cron
    cronJob.start();
});

// Login Bot
client.login(_env.BOT_TOKEN);