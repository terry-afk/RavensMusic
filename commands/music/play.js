const { VoiceConnection } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require("ytdl-core-discord");

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            group: 'music',
            memberName: 'play',
            description: 'Play a music from Youtube',
            args: [
                {
                    key: 'query',
                    prompt: 'Which music do you want to play ?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, { query }) {
        await message.member.voice.channel.join().then((connection) => {
            this.runVideo(message, connection, query);
        });
    }

    async runVideo(message, connection, video) {
        const dispatcher = connection.play(await ytdl(video, { filter: 'audioonly' }), { type: 'opus' });

        dispatcher.on('finish', () => {
            message.member.voice.channel.leave();
        });
    }
}