const { Command, CommandoMessage } = require("discord.js-commando");
const { StreamDispatcher } = require("discord.js");
const { UserNotConnected, BotNotInVoiceChanel, Resume } = require('../../strings.json');

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
            return message.say(UserNotConnected);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChanel);
        }

        if (dispatcher) {
            dispatcher.resume();
        }

        return message.say(Resume)
    }
}