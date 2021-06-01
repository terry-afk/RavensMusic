const { CommandoClient } = require('discord.js-commando');
const path = require("path");

const client = new CommandoClient({
    commandPrefix: '!',
    owner: '243342142775230466',
    invite: 'https://discord.gg/8nsFQAfH'
});

client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerGroup('music', 'Music')
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.server = {
    queue: [],
    currentVideo: { title: "", url:"" },
    dispatcher: null
};

client.once('ready', () => {
    console.log(`Connected as ${client.user.tag} - (${client.user.id})`);
});

client.on('error', (error) => console.error(error));

client.login("ODQ4OTE0NzIwNTcxNjU0MTY1.YLTjcQ.hHuyjlE_6R9hHuJvck-zmm-HQW4")