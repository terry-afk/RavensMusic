const { VoiceConnection } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require("ytdl-core-discord");

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            group: 'music',
            memberName: 'pause',
            description: 'Pause a current music.',
        })
    }

    async run(message) {
        console.log(message.member.voice.channel);
        if (!message.member.voice.channel) {
            return message.say(":x: You must be in a vocal channel.");
        }

        if (!message.client.voice.connections.first()) {
            return message.say(":x: I'm not connected. Please use `join` to add me.");
        }

        if (message.client.server.dispatcher) {
            message.client.server.dispatcher.pause();
        }

        return message.say(":pause_button: Pause :thumbsup:")
    }
}