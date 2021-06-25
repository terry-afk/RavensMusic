const { VoiceConnection, User } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotConnected, AddedToQueue } = require('../../strings.json');
const { key } = require("../../config.json");
const ytdl = require("ytdl-core-discord");

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
            const video = {title: "", url: query}

            if (server.currentVideo.url != "") {
                server.queue.push(video);
                return message.say("`" + video.url + "`" + AddedToQueue);
            }
            server.currentVideo = video;
            this.runVideo(message, connection, query);
        });
    }

    async runVideo(message, connection, query) {
        const server = message.client.server;
        const dispatcher = connection.play(ytdl(query, { filter: 'audioonly' }), { type: "opus" });

        server.queue.shift();
        server.dispatcher = dispatcher;
        server.connection = connection;

        dispatcher.on('finish', () => {
            if (server.queue[0]) {
                server.currentVideo = server.queue[0];
                return this.runVideo(message, connection);
            }
            server.currentVideo = { title: "Noting right now !", url: "" }
            return message.say("Queue ended !");
        });

        return message.say("Now playing `" + server.currentVideo.title + "` :notes:");
    }
}