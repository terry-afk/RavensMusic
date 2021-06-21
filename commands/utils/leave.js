const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotConnected, BotNotInVoiceChanel } = require('../../strings.json');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            group: 'utils',
            memberName: 'leave',
            description: 'Leave the current channel.',
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
        server.queue.splice(0, server.queue.length);
        server.currentVideo = { title: "Noting right now !", url: "" };
        message.say("Cleaning the queue !")

        await voiceChannel.leave();
        return message.say(":thumbsup: Leaving " + "`" + voiceChannel.name + "`")
    }
}