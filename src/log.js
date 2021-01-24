const fs = require('fs/promises');

const d = new Date();
const logfile = `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}_${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}${d.getSeconds().toString().padStart(2, '0')}.log`;

let firstLine = true;
const log = (() => {
    let promise = Promise.resolve();
    return async (str) => {
        await promise;
        const d = new Date();
        promise = fs.writeFile(logfile, `${firstLine?'':'\n'}[${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}] ${str}`, { flag: 'a' }).catch((err) => console.error(err));
        firstLine = false;
        return promise;
    }
})();

module.exports = log;
