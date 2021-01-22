const DiscordRPC = require('discord-rpc');
const settings = require('./settings');

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

rpc.login({ clientId: settings.discord.clientId || '801823750495666237' });

module.exports = rpc;
