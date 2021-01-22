const ini = require('multi-ini');
const log = require('./log');

const settings = {
    discord: { clientId: '801823750495666237' },
    miner: { address: 'localhost:3333' },
    appID: 'faleij.discord-cryptominer-presence',
    appName: 'Discord Cryptominer Presence',
};

try {
    const _settings = ini.read('config.ini');
    Object.assign(settings.discord, _settings.discord);
    Object.assign(settings.miner, _settings.miner);
} catch(err) {
    if (err.errno !== -4058) {
        console.error(err);
        log(err.stack || err.toString());
    }
}

module.exports = settings;