const fs = require('fs/promises');

const d = new Date();
const logfile = `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}_${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}${d.getSeconds().toString().padStart(2, '0')}.log`;

const log = (() => {
    let promise = Promise.resolve();
    return async (str) => {
        await promise.catch(() => undefined);
        return promise = fs.writeFile(logfile, str + '\n', { flag: 'a' });
    }
})();

module.exports = log;
