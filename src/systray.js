const SysTray = require('systray2').default;
const _fs = require('fs');
const os = require('os');
const path = require('path');
const rpc = require('./discord');
const settings = require('./settings');
const fs = require('fs/promises');
const { execFile } = require('child_process');
const exitHook = require('async-exit-hook');

const iconPath = path.join(__dirname, 'eth.ico');
const iconBuffer = _fs.readFileSync(iconPath);
const winStartupPath = process.env.APPDATA + '/Microsoft/Windows/Start Menu/Programs/Startup/Discord Cryptominer Presence.lnk';
const platform = os.platform();

// copy icon to os tmp dir
fs.writeFile(path.join(os.tmpdir(), 'eth.ico'), iconBuffer, err => console.error(err));

function installStartup() {
    if (platform !== 'win32') return;
    console.log('installStartup', platform, process.execPath);

    execFile('./notifier/snoreToast/snoretoast-x64.exe', ['-install', 'Startup\\Discord Cryptominer Presence.lnk', `${process.execPath}`, `${settings.appID}`], (error, stdout, stderr) => {
        if (error) {
          console.error(error);
        }
        console.error(stderr);
        console.log(stdout);
    });
}

function uninstallStartup() {
    console.log('uninstallStartup', platform);
    if (platform !== 'win32') return;
    return fs.unlink(winStartupPath);
}

const autostartItem = {
    title: "Autostart at logon",
    tooltip: `Run ${settings.appName} on windows login`,
    // checked is implement by plain text in linux
    checked: !true,
    enabled: true,
    click: ({ item, seq_id = 0 }) => {
        item.checked = !item.checked;
        systray.sendAction({
            type: 'update-item',
            item,
            seq_id,
        });
        if (item.checked) {
            installStartup();
        } else {
            uninstallStartup();
        }
    },
};

const items = [
    autostartItem,
    {
        title: "Exit",
        // tooltip: "",
        checked: false,
        enabled: true,
        click: () => {
            try {
                rpc.clearActivity();
            } catch(err) {}
            systray.kill(true);
        },
    },
];

const systray = new SysTray({
    menu: {
        // you should using .png icon in macOS/Linux, but .ico format in windows
        icon: iconBuffer.toString('base64'),
        title: "Discord Cryptominer Presence",
        tooltip: "Discord Cryptominer Presence",
        items,
    },
    debug: false,
    copyDir: !true, // copy go tray binary to outside directory, useful for packing tool like pkg.
});
systray.onClick(action => {
    console.dir(action);
    if (items[action.seq_id].click) {
        items[action.seq_id].click(action);
    }
});
systray.ready().catch(err => console.error(err));

exitHook(async (cb) => {
    await systray.kill(false);
    cb();
});

fs.access(winStartupPath, _fs.F_OK).then(async () => {
    autostartItem.checked = true;
    await systray.ready();
    systray.sendAction({
        type: 'update-item',
        item: autostartItem,
    });
}, async (err) => {
    autostartItem.checked = !true;
    await systray.ready();
    systray.sendAction({
        type: 'update-item',
        item: autostartItem,
    });
});

module.exports.systray = systray;
