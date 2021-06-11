const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require("ytdl-core-discord");
const { UserNotConnected, BotNotInVoiceChanel, Skip, EmptyQueue } = require('../../strings.json');

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'music',
            memberName: 'skip',
            description: 'Skip the current music.',
        })
    }

    async run(message) {
        const voiceChannel = message.member.voice.channel;
        const server = message.client.server;

        if (!voiceChannel) {
            return message.say(UserNotConnected);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChanel);
        }

        server.queue.shift();

        if (!server.queue[0]) {
            server.currentVideo = {title: "Nothing right now !", url: ""};
            return message.say(EmptyQueue);
        }

        server.currentVideo = server.queue[0];
        server.connection.play(await ytdl(server.currentVideo.url, { filter: 'audioonly' }), { type: 'opus' });

        return message.say(Skip);
    }
}