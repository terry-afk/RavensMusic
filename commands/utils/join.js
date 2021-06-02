const { Command, CommandoMessage } = require("discord.js-commando");

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'utils',
            memberName: 'join',
            description: 'Join the current channel.',
        })
    }

    async run(message) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.say(":x: You must be in a vocal channel.");
        }

        await voiceChannel.join();

        return message.say(":thumbsup: Joining " + "`" + voiceChannel.name + "`")
    }
}