const { app, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const Store = require('electron-store');
const store = new Store();

const labels = store.get('labels', [
  { name: "Default", color: "#944957" }
]);

ipcMain.handle("setCalendarURL", (event, url) => {
  store.set("calendarURL", url)
})


const ical = require("node-ical")

ipcMain.handle("getCalendarEvents", async () => {

  const url = store.get("calendarURL")

  if (!url) return []

  const data = await ical.async.fromURL(url)

  const events = []

  for (const k in data) {
    const event = data[k]

    if (event.type === "VEVENT") {
      events.push({
        title: event.summary,
        start: event.start,
        end: event.end
      })
    }
  }

  return events
})

const tasks = store.get('tasks', []);

const windowOpenHandler = ({ url }) => {
  const baseOptions = {
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  };

  if (url.includes('createTask.html')) {
    return { 
      action: 'allow',
      overrideBrowserWindowOptions: { ...baseOptions, width: 500, height: 250 }
    };
  }

  if (url.includes('createLabel.html')) {
    return { 
      action: 'allow',
      overrideBrowserWindowOptions: { ...baseOptions, width: 350, height: 200 }
    };
  }

  return { action: 'deny' }; 
};

function createWindow() {
  const win = new BrowserWindow({
    width: 1130,
    height: 850,
    frame: false,
    autoHideMenuBar: true, // Hides the old-school File/Edit menu
    useContentSize: true, 
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') 
    }
  });

  win.loadFile("index.html");
}

app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(windowOpenHandler);
});

ipcMain.on('minimize-me', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});
ipcMain.on('maximize-toggle', (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);

    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.handle('get-label', (event)=> {
  return labels;
}
)
ipcMain.on('update-labels', (event, newLabel) => {
  labels.length = 0;
  labels.push(...newLabel);

  store.set('labels', labels);

  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('update-data-l', labels);
  });

});

ipcMain.handle('get-tasks', (event)=>{
  return tasks;
})

ipcMain.on('update-tasks', (event, newTasks)=>{
  tasks.length = 0;
  tasks.push(...newTasks);

  store.set('tasks', tasks);

    BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('update-data-t', tasks);
  });

})

app.whenReady().then(createWindow);