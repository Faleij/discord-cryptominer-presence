const claymoreAPI = require('claymore-node-api');

function parseStat(stat) {
    return [
        stat[0],
        +stat[1],
        stat[2].split(';').map(Number),
        stat[3].split(';').map(Number),
        stat[4].split(';').map(Number),
        stat[5].split(';').map(Number),
        stat[6].split(';').map(Number),
        stat[7].split(';'),
        stat[8].split(';').map(Number),
    ];
}
module.exports.parseStat = parseStat;

function sumRow(p, c, r) {
    p[r].forEach((v, i) => p[r][i] += c[r][i]);
}

function mergeParsedStats(p, c) {
    if (c[1] > p[1]) p[1] = c[1];
    sumRow(p, c, 2);
    p[3].push(...c[3]);
    sumRow(p, c, 4);
    p[5].push(...c[5]);
    p[6].push(...c[6]);
    p[7].push(...c[7]);
    sumRow(p, c, 8);
    return p;
}
module.exports.mergeParsedStats = mergeParsedStats;

function serializeStat(stat) {
    return [
        stat[0],
        stat[1].toString(),
        stat[2].join(';'),
        stat[3].map(v => Number.isNaN(v) ? 'off' : v).join(';'),
        stat[4].map(v => Number.isNaN(v) ? 'off' : v).join(';'),
        stat[5].map(v => Number.isNaN(v) ? 'off' : v).join(';'),
        stat[6].join(';'),
        stat[7].join(';'),
        stat[8].join(';'),
    ];
}
module.exports.serializeStat = serializeStat;

module.exports.loadStatsFromMultiple = async (addresses = [], onError = (err) => { throw err }) => {
    let stats;
    await Promise.all(addresses.map(async (address) => {
        try {
            const [host, port = 3333] = address.split(':');
            const stat = await claymoreAPI.getStats(host, port);
            const parsed = parseStat(stat);
            if (!stats) stats = parsed;
            else mergeParsedStats(stats, parsed);
        } catch (err) {
            onError(err, address);
        }
    }));
    if (!stats) return;
    return claymoreAPI.toStatsJson(serializeStat(stats));
}
