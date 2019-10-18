// Libraries
const _env = require('dotenv').config().parsed;
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('cron');
const Discord = require('discord.js');

// Client
let client = new Discord.Client();


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
let cornNsfw = new cron.CronJob('*/1 * * * *', () => {

    // Request message every 1 min
    // Fetch image
    getImage().then(image => {

        if (image !== undefined) {

            // Channel id
            let channel = client.channels.get(_env.NSFW_CHANNEL_ID);

            // Send message
            channel.send("", {files: [image]});

        }

    });

});

// Bot ready
client.on('ready', () => {
    // Start cron
    cornNsfw.start();
});

// Login Bot
client.login(_env.BOT_TOKEN);