const { exec } = require('pkg')
const fse = require('fs-extra');
const createNodewExe = require('create-nodew-exe');

(async () => {
    await Promise.all([
        fse.copy('node_modules/node-notifier/vendor', 'dist/notifier'),
        fse.copy('node_modules/systray2/traybin', 'dist/traybin'),
    ]);
    await exec([ '.', '--out-path', './dist', '--options', 'always-compact' ]);
    await fse.rename('./dist/discord-cryptominer-presence.exe', './dist/discord-cryptominer-presence_debug.exe');
    createNodewExe({
        src: './dist/discord-cryptominer-presence_debug.exe',
        dst: './dist/discord-cryptominer-presence.exe',
    });
    if (process.argv.includes('release')) await fse.remove('./dist/discord-cryptominer-presence_debug.exe');
})().catch(err => console.error(err));
