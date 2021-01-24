const { exec } = require('pkg')
const fse = require('fs-extra');
const createNodewExe = require('create-nodew-exe');

(async () => {
    await Promise.all([
        fse.copy('./node_modules/node-notifier/vendor/notifu', './dist/notifier/notifu'),
        fse.copy('./node_modules/node-notifier/vendor/snoreToast', './dist/notifier/snoreToast'),
        fse.copy('./node_modules/systray2/traybin/tray_windows_release.exe', './dist/traybin/tray_windows_release.exe'),
    ]);
    await exec([ '.', '--out-path', './dist', '--options', 'always-compact' ]);
    await fse.rename('./dist/discord-cryptominer-presence.exe', './dist/discord-cryptominer-presence_debug.exe');
    createNodewExe({
        src: './dist/discord-cryptominer-presence_debug.exe',
        dst: './dist/discord-cryptominer-presence.exe',
    });
    if (process.argv.includes('release')) await fse.remove('./dist/discord-cryptominer-presence_debug.exe');
})().catch(err => {
    console.error(err);
    process.exit(1);
});
