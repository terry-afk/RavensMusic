const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotConnected } = require("../../strings.json");

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
            return message.say(UserNotConnected);
        }

        await voiceChannel.join();

        return message.say(":thumbsup: Joining " + "`" + voiceChannel.name + "`")
    }
}