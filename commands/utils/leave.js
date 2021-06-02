const { Command, CommandoMessage } = require("discord.js-commando");

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

        if (!voiceChannel) {
            return message.say(":x: You must be in a vocal channel.");
        }

        await voiceChannel.leave();

        return message.say(":thumbsup: Leaving " + "`" + voiceChannel.name + "`")
    }
}