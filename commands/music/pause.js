const { Command, CommandoMessage } = require("discord.js-commando");
const { StreamDispatcher } = require("discord.js");

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            group: 'music',
            memberName: 'pause',
            description: 'Pause the current music.',
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
            dispatcher.pause();
        }

        return message.say(":pause_button: Pause")
    }
}