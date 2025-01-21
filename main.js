const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// 设置应用程序用户模型ID
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});

// 设置日志
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

function setupAutoUpdater() {
    autoUpdater.on('checking-for-update', () => {
        console.log('正在检查更新...');
    });

    autoUpdater.on('update-available', () => {
        console.log('发现新版本...');
    });

    autoUpdater.on('update-not-available', () => {
        console.log('当前已经是最新版本.');
    });

    autoUpdater.on('error', (error) => {
        console.error('更新出错:', error);
    });

    autoUpdater.on('update-downloaded', () => {
        console.log('下载完成，准备安装...');
        showUpdateDialog();
    });
}

function showUpdateDialog() {
    dialog.showMessageBox({
        type: 'info',
        title: '更新提示',
        message: '新版本已下载，是否立即安装更新？',
        buttons: ['立即更新', '稍后更新']
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
}

function checkForUpdates() {
    console.log('进来了');
    autoUpdater.checkForUpdatesAndNotify();
}

function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 300,
    });

    win.webContents.openDevTools();
    win.loadURL('https://www.baidu.com');
}

app.whenReady().then(() => {
    setupAutoUpdater();
    createWindow();
    checkForUpdates();
});
