const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require("ytdl-core-discord");
const { UserNotConnected, BotNotInVoiceChanel, Skip, NotEnough } = require('../../strings.json');

module.exports = class SkipToCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skipto',
            group: 'music',
            memberName: 'skipto',
            description: 'Skip to the desired music in the queue !',
            args: [
                {
                    key: "index",
                    prompt: "To which position do you want to jump ?",
                    type: "integer"
                },
            ]
        })
    }

    async run(message, { index }) {
        const voiceChannel = message.member.voice.channel;
        const server = message.client.server;

        if (!voiceChannel) {
            return message.say(UserNotConnected);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChanel);
        }

        index--;

        if (!server.queue[index]) {
            server.currentVideo = {title: "Nothing right now !", url: ""};
            return message.say(NotEnough);
        }

        server.currentVideo = server.queue[index];

        server.dispatcher = server.connection.play(ytdl(server.currentVideo.url, { filter: 'audioonly' }), { type: "opus" });
        server.queue.splice(index, 1);

        return message.say(Skip);
    }
}