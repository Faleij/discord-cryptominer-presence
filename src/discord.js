const DiscordRPC = require('discord-rpc');
const settings = require('./settings');

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

function connect() {
    try {
        rpc.login({ clientId: settings.discord.clientId || '801823750495666237' });
    } catch(err) {
        console.error(err);
        setTimeout(connect, 1000*3);
    }
}

rpc.on('disconnected', connect);
connect();

module.exports = rpc;
