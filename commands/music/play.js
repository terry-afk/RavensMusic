const { VoiceConnection } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
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
            return message.say(":x: You must be in a vocal channel.");
        }

        await message.member.voice.channel.join().then((connection) => {
            if (server.currentVideo.url != "") {
                server.queue.push({ title: "", url: query });
                return message.say("Added to the queue :thumbsup:");
            }
            server.currentVideo = { title: "", url: query };
            this.runVideo(message, connection, query);
        });
    }

    async runVideo(message, connection, video) {
        const server = message.client.server;
        const dispatcher = connection.play(await ytdl(video, { filter: 'audioonly' }), { type: 'opus' });

        server.queue.shift();
        server.dispatcher = dispatcher;

        dispatcher.on('finish', () => {
            if (server.queue[0]) {
                server.currentVideo = server.queue[0];
                return this.runVideo(message, connection, server.currentVideo.url);
            }
        });

        return message.say("Now playing `" + server.currentVideo.title + "` :notes:");
    }
}