const fs = require('fs/promises');

const logfile = `${Date.now()}.log`;

const log = (() => {
    let promise = Promise.resolve();
    return async (str) => {
        await promise.catch(() => undefined);
        return promise = fs.writeFile(logfile, str + '\n', { flag: 'a' });
    }
})();

module.exports = log;
