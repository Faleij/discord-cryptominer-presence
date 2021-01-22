const { exec } = require('pkg')
const fse = require('fs-extra');
const { promisify } = require('util');
const _exec = promisify(require('child_process').exec);

(async () => {
    await Promise.all([
        fse.copy('node_modules/node-notifier/vendor', 'dist/notifier'),
        fse.copy('node_modules/systray2/traybin', 'dist/traybin'),
    ]);
    await exec([ '.', '--out-path', './dist', '--options', 'always-compact' ]);
    await fse.rename('./dist/discord-cryptominer-presence.exe', './dist/discord-cryptominer-presence_debug.exe');
    await _exec('create-nodew-exe ./dist/discord-cryptominer-presence_debug.exe ./dist/discord-cryptominer-presence.exe');
})().catch(err => console.error(err));
