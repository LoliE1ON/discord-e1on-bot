const axios = require('axios')
const cheerio = require('cheerio')
const cron = require('cron')
let channels = require("./channels.json")

module.exports = class Bot {

    lastNsfwLink = '';

    constructor(client) {

        this.client = client;

        this.run().catch((e) => {
            console.log(e)
        })

    }

    async run() {

        // Cron
        this.cron();
    }

    // Request message every 30 min
    async cron() {

        this.cronJob = new cron.CronJob('*/20 * * * *', () => {

            // Fetch image
            this.request().then(image => {

                if (image.length > 0) {

                    for (let channel of channels.list) {

                        // Channel id
                        let discord = this.client.channels.get(channel);

                        // Send message
                        discord.send("", {files: [image]});

                        console.log(`Request message ${image}`)
                    }

                }

            });

            // Fetch nsfw image
            this.requestNsfw().then(image => {

                if (image.length > 0) {

                    for (let channel of channels.nsfw) {

                        // Channel id
                        let discord = this.client.channels.get(channel);

                        // Send message
                        discord.send("", {files: [image]});

                        console.log(`Request nsfw message ${image}`)
                    }

                }

            });

        });

        // Start cron
        this.cronJob.start();

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

            // Parse html
            // Image
            let parse = $('div.post_content,allow_long > div.image > a.prettyPhotoLink'),
                image = parse.find('img').attr('src');

            // Image validation
            if (image != '//css.reactor.cc/images/unsafe_ru.gif' && image.length > 0) {

                // Return image url
                return image;

            }

        }
        catch (err) {
            console.error(err);
        }

    }

    // Get random image
    async requestNsfw() {

        try {

            // Request
            let res = await axios({
                url: 'http://anime.reactor.cc/tag/Anime+Ero',
                method: 'get',
                timeout: 8000,
            });

            // Html root
            const $ = cheerio.load(res.data);

            // Parse html
            // Image

            let parse = $('div > div.post_top > div.post_content > div.image'),
                image = parse.find('img').attr('src');

            // Image validation
            if (image != '//css.reactor.cc/images/unsafe_ru.gif' && image.length > 0 && this.lastNsfwLink !== image) {

                this.lastNsfwLink = image;
                // Return image url
                return image;

            } else {
                console.log("Дубль")
                return "";
            }

        }
        catch (err) {
            console.error(err);
        }

    }

};