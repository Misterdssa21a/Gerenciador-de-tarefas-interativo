const { app, BrowserWindow } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

let janela;

function criarJanela() {
    janela = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: "#f5f6fa",

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    janela.loadFile(
        path.join(__dirname, "index.html")
    );
}

app.whenReady().then(() => {
    criarJanela();

    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-available", () => {
    console.log("Nova atualização encontrada.");
});

autoUpdater.on("update-downloaded", () => {
    console.log(
        "Atualização baixada. O aplicativo será atualizado."
    );

    autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});