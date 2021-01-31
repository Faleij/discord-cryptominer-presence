const _notifier = require('node-notifier');
const utils = require('node-notifier/lib/utils');
const os = require('os');
const fs = require('fs');
const settings = require('./settings');
const { execFile } = require('child_process');
const NotificationCenter = require('node-notifier/notifiers/notificationcenter');
const WindowsToaster = require('node-notifier/notifiers/toaster');
const WindowsBalloon = require('node-notifier/notifiers/balloon');
const path = require('path');

let iconPath = path.join(os.tmpdir(), 'eth.ico');
const is64Bit = os.arch() === 'x64';
const osType = utils.isWSL() ? 'WSL' : os.type();
const options = { withFallback: true };
let notifier;

switch (osType) {
    case 'Darwin':
        notifier = new NotificationCenter({
            customPath: './notifier/mac.noindex/terminal-notifier.app/Contents/MacOS/terminal-notifier',
            ...options,
        });
        notifier.Notification = NotificationCenter;
        break;
        case 'Windows_NT':
        if (utils.isLessThanWin8()) {
            notifier = new WindowsBalloon({
                customPath: './notifier/notifu/notifu' + '-x' + (is64Bit ? '64' : '86') + '.exe',
                ...options,
            });
            notifier.Notification = WindowsBalloon;
        } else {
            execFile('./notifier/snoreToast/snoretoast-x64.exe', ['-install', 'Discord Cryptominer Presence\\Discord Cryptominer Presence.lnk', `${process.execPath}`, `${settings.appID}`], (error, stdout, stderr) => {
                if (error) {
                    console.error(error);
                }
                console.error(stderr);
                console.log(stdout);
            });
            
            notifier = new WindowsToaster({
                customPath: './notifier/snoreToast/snoretoast' + '-x' + (is64Bit ? '64' : '86') + '.exe',
                ...options,
            });
            const _notify = notifier.notify;
            notifier._notify = (opt) => typeof opt === 'string' ? _notify({ title: 'Discord Cryptominer Presence', appID: settings.appID, message: opt, icon: iconPath }) : _notify({ appID: settings.appID, ...opt });
            notifier.Notification = WindowsToaster;
        }
        break;
    default:
        notifier = _notifier;
}

module.exports = notifier;

let idn = 1;
module.exports.notifyError = (err, address = '') => {
    const text = address.length ? `[${address}]: ${err}` : err.toString();
    const id = idn++;
    notifier.notify({
        title: 'Error',
        message: text,
        type: 'error',
        appID: settings.appID,
        icon: iconPath,
        id,
        wait: true,
    });
    if (idn === Number.MAX_SAFE_INTEGER) idn = 1;
    return id;
};
