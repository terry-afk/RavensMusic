const { Command, CommandoMessage } = require("discord.js-commando");
const { StreamDispatcher } = require("discord.js");

module.exports = class ResumeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            group: 'music',
            memberName: 'resume',
            description: 'Resume the current music.',
        })
    }

    async run(message) {
        /**
         * @type StreamDispatcher
         */
        const dispatcher = message.client.server.dispatcher;
        if (!message.member.voice.channel) {
            return message.say(":x: You must be in a vocal channel.");
        }

        if (!message.client.voice.connections.first()) {
            return message.say(":x: I'm not connected. Please use `join` to add me.");
        }

        if (dispatcher) {
            dispatcher.resume();
        }

        return message.say("Playing :notes:")
    }
}