const { VoiceConnection, User } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotConnected, AddedToQueue } = require('../../strings.json');
const { key } = require("../../config.json");
const ytdl = require("ytdl-core");
const ytsr = require("youtube-search");

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            group: 'music',
            memberName: 'play',
            description: 'Play a music from Youtube.',
            args: [
                {
                    key: 'query',
                    prompt: 'Which music do you want to play ?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, { query }) {
        const server = message.client.server;

        if (!message.member.voice.channel) {
            return message.say(UserNotConnected);
        }

        await message.member.voice.channel.join().then((connection) => {

            ytsr(query, { key: key, maxResults: 1, type: "video" }).then((results) => {
                if (results.results[0]) {
                    const foundVideo = { title: results.results[0].title, url: results.results[0].link };

                    if (server.currentVideo.url != "") {
                        server.queue.push(foundVideo);
                        return message.say("`" + foundVideo.title + "`" + AddedToQueue);
                    }
                    server.currentVideo = foundVideo;
                }
                this.runVideo(message, connection);
            })
        });
    }

    async runVideo(message, connection) {
        const server = message.client.server;
        const dispatcher = connection.play(await ytdl(server.currentVideo.url, { filter: 'audioonly' }));

        server.queue.shift();
        server.dispatcher = dispatcher;
        server.connection = connection;

        dispatcher.on('finish', () => {
            if (server.queue[0]) {
                server.currentVideo = server.queue[0];
                return this.runVideo(message, connection, server.currentVideo.url);
            }
        });

        return message.say("Now playing `" + server.currentVideo.title + "` :notes:");
    }
}