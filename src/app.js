const url = require('url');
const log = require('./log');
const notifier = require('./notifier');
const settings = require('./settings');
const rpc = require('./discord');
const { loadStatsFromMultiple } = require('./claymore-api-utils');

let clearedActivity;
let noEndpointsReachableNotificationId;
const addressErrorSet = new Map();
async function setActivity() {
    try {
        const addresses = settings.miner.address.split(',');
        let stats = await loadStatsFromMultiple(addresses, (err, address) => {
            const notificationId = addressErrorSet.get(address);
            if (err) {
                if (!notificationId) {
                    console.error(`Error using server ${address}`, err);
                    addressErrorSet.set(address, notifier.notifyError(err, address));
                    log(`Error using server ${address}: ` + (err.stack || err.toString()));
                }
            } else if (notificationId) {
                addressErrorSet.delete(address);
                notifier.notify({ close: notificationId });
            }
        });
        if (!stats) {
            if (!clearedActivity) {
                rpc.clearActivity();
                clearedActivity = true;
            }
            if (!noEndpointsReachableNotificationId) {
                noEndpointsReachableNotificationId = notifier.notifyError('No miner api endpoints reachable!');
            }
        } else {
            if (noEndpointsReachableNotificationId) notifier.notify({ close: noEndpointsReachableNotificationId });
            noEndpointsReachableNotificationId = undefined;
            // const stats = await claymoreAPI.getStatsJson('localhost', 3333);
            const pool = url.parse(stats.ethash.pool || stats.dcoin.pool).hostname;
            const tempSensors = stats.sensors.filter(c => Number.isFinite(c.temperature));
            const temp = tempSensors.reduce((p, c) => p + c.temperature, 0) / tempSensors.length;
            const statusLineParts = [];
            const coins =  [];
            if (stats.ethash.hashrate) coins.push('ETH');
            if (stats.dcoin.hashrate) coins.push('DCoin');
            if (coins.length) statusLineParts.push(`${stats.ethash.hashrate + stats.dcoin.hashrate} MH/s`);
            if (tempSensors.length) statusLineParts.push(`${temp}°C`);
            rpc.setActivity({
                details: coins.length ? `Mining ${coins.join(' & ')} on ${pool}` : 'Miner paused',
                state: coins.length ? statusLineParts.join(', ') : undefined,
                startTimestamp: new Date(Date.now() - (stats.uptime * 60 * 1000)),
                instance: false,
                largeImageKey: stats.ethash.hashrate ? 'eth' : stats.dcoin.hashrate ? 'dcoin' : undefined,
            });
            clearedActivity = false;
        }
    } catch(err) {
        if (!clearedActivity) {
            clearedActivity = true;
            try {
                rpc.clearActivity();
            } catch(err) {
                console.error(err);
                log(err.stack || err.toString());
            }
        }
        console.error(err);
        log(err.stack || err.toString());
    } finally {
        setTimeout(setActivity, 30e3);
    }
}

rpc.on('ready', setActivity);
