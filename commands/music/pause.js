const { Command, CommandoMessage } = require("discord.js-commando");
const { StreamDispatcher } = require("discord.js");
const { UserNotConnected,BotNotInVoiceChanel, Pause } = require('../../strings.json');

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
            return message.say(UserNotConnected);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChanel);
        }

        if (dispatcher) {
            dispatcher.pause();
        }

        return message.say(Pause);
    }
}