const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const { dialog } = require('electron')

//const handleUpdate = require("./handleUpdate");

// 自动更新检查
function checkForUpdates() {

    // 检查新版本
    autoUpdater.checkForUpdates()
    autoUpdater.updateConfigPath = "./latest.yml"

    // 监听更新事件
    autoUpdater.on('checking-for-update', () => {
        console.log('正在检查更新...')
    })

    autoUpdater.on('update-available', () => {
        console.log('发现新版本...')
    })

    autoUpdater.on('update-not-available', () => {
        console.log('当前已经是最新版本.')
    })

    autoUpdater.on('error', (error) => {
        console.error('更新出错:', error)
    })

    autoUpdater.on('update-downloaded', (_) => {
        console.log('下载完成，准备安装...')
        // 下载完成后进行弹窗提示(也可以直接调用autoUpdater.quitAndInstall()进行更新)
        showUpdateDialog()
    })
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080
    })
    win.webContents.openDevTools()
    win.loadFile('index.html')

    // 监听键盘事件
    win.on('focus', () => {
        const { Menu } = require('electron');
        let menu = Menu.getApplicationMenu();
        if (menu) {
            menu.items.forEach((item) => {
                if (item.role === 'reload') {
                    item.accelerator = 'F5';
                }
            });
        }
    });
    // 监听F5键
    win.on('window-focus', () => {
        const { globalShortcut } = require('electron');
        globalShortcut.register('F5', () => {
            win.webContents.reload();
        });
    });
    //========================================

    //========================================

    //检查更新

    //handleUpdate(win, ipcMain)
}

function showUpdateDialog() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '更新可用',
        message: '发现新版本，需要立即更新！',
        buttons: ['立即更新'],
    }).then(result => {
        if (result.response === 0) {
            /**
             * 用户点击 "立即更新" 按钮，执行更新
             * 形参:
             * 参数1：仅在静默模式下运行安装程序。默认为false（windows下有效）。
             * 参数2：即使是静默安装，也要在完成后运行应用程序。不适用于macOS。如果 参数1 设置为false，则忽略（在这种情况下，您仍然可以将autoRunAppAfterInstall设置为false以防止在完成后运行应用程序）
             */
            autoUpdater.quitAndInstall(true, true);
        }
    });
}


// 设置用户任务
app.setUserTasks([
    {
        program: process.execPath,
        arguments: '--new-window',
        iconPath: process.execPath,
        iconIndex: 0,
        title: '房间入住',
        description: 'Create a new window'
    },
    {
        program: process.execPath,
        arguments: '--new-window',
        iconPath: process.execPath,
        iconIndex: 0,
        title: '退房',
        description: 'Create a new window'
    },
])

// 设置应用程序用户模型ID
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});


app.whenReady().then(() => {
    createWindow()

    checkForUpdates()
})