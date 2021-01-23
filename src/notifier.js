const _notifier = require('node-notifier');
const utils = require('node-notifier/lib/utils');
const os = require('os');
const settings = require('./settings');
const { execFile } = require('child_process');
const NotificationCenter = require('node-notifier/notifiers/notificationcenter');
const WindowsToaster = require('node-notifier/notifiers/toaster');
const WindowsBalloon = require('node-notifier/notifiers/balloon');

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
            notifier._notify = (opt) => typeof opt === 'string' ? _notify({ title: 'Discord Cryptominer Presence', appID: settings.appID, message: opt }) : _notify(opt);
            notifier.Notification = WindowsToaster;
        }
        break;
    default:
        notifier = _notifier;
}

module.exports = notifier;

const notificationHistory = new Set();

module.exports.notifyError = (err, address = '', id) => {
    const text = address.length ? `[${address}]: ${err}` : err.toString();
    id = id || text;
    if (notificationHistory.has(id)) return;
    notificationHistory.add(id);
    notifier.notify({
        title: 'Error',
        message: text,
        type: 'error',
        appID: settings.appID,
    });
    if (!id) setTimeout(() => notificationHistory.delete(id), 30*60e3);
};

module.exports.clearErrorNotification = (id) => {
    notificationHistory.delete(id);
};
