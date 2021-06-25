const { MessageEmbed } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const { BotNotInVoiceChanel, PageDoesntExist, EmptyQueue } = require('../../strings.json');

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['q'],
            group: 'music',
            memberName: 'queue',
            description: 'Display the waiting queue.',
            args: [
                {
                    key: 'page',
                    prompt: "Which page do you want to see ?",
                    default: 1,
                    type: 'integer'
                }
            ],
        })
    }

    async run(message, { page }) {
        const server = message.client.server;

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChanel);
        }

        if (server.currentVideo.url == "") {
            return message.say(EmptyQueue);
        }

        const numberOfItems = 10;
        const startingItem = (page - 1) * numberOfItems;
        const queueLength = server.queue.length;

        var itemsPerPage = startingItem + numberOfItems;
        var totalPages = 1;

        var embed = new MessageEmbed()
                .setTitle(`Wating queue for ${message.author.username}`)
                .setColor("BLUE")
                .addField("Now playing :", server.currentVideo.title);

        if (queueLength > 0) {
            var value = "";

            if (queueLength > numberOfItems) {
                totalPages = Math.ceil(queueLength / numberOfItems);
            }

            if (page < 0 || page > totalPages) {
                return message.say(PageDoesntExist);
            }

            if (queueLength - startingItem < numberOfItems) {
                itemsPerPage = (queueLength - startingItem) + startingItem;
            }

            for (let i = startingItem; i < itemsPerPage; i++) {
                const video = server.queue[i];
                value += "`" + (i + 1) + ".` " + video.title + "\n";
            }
            embed.addField("Coming :", value);
        }
        embed.setFooter(`Page ${page}/${totalPages}`);

        return message.say(embed);
    }
}