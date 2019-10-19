const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('cron');

module.exports = class Bot {

    constructor(client, channel) {

        this.client = client;
        this.channel = channel;

        this.run().catch((e) => {
            console.log(e)
        })

    }

    async run() {

        // Cron job
        this.cron();

        // Start cron
        this.client.on('ready', () => {
            this.cronJob.start();
        });

    }

    // Request message every 30 min
    async cron() {

        this.cronJob = new cron.CronJob('*/1 * * * *', () => {

            // Fetch image
            this.request().then(image => {

                // Channel id
                let discord = this.client.channels.get(this.channel);

                // Send message
                discord.send("", {files: [image]});

                console.log(`Request message ${image}`)

            });

        });

    }

    // Get random image
    async request() {

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
                let src = $img.attr('src');

                if (src !== "//css.reactor.cc/images/unsafe_ru.gif" || src.length > 0) {
                    image = src;
                }

            });

            return image;

        }
        catch (err) {
            console.error(err);
        }

    }

};