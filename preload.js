const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('minimize-me')
});

contextBridge.exposeInMainWorld('labelAPI', {
  getLabels: () => ipcRenderer.invoke('get-label'),
  updateLabels: (newList) => ipcRenderer.send('update-labels', newList),
  onUpdate: (callback) => ipcRenderer.on('update-data-l', (event, value) => callback(value))

})  

contextBridge.exposeInMainWorld('taskAPI',{
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  updateTasks: (newTasks) => ipcRenderer.send('update-tasks', newTasks),
  onUpdateTask: (callback) => ipcRenderer.on('update-data-t', (event, values) => callback(values))
})


contextBridge.exposeInMainWorld("calendarAPI", {
  getEvents: () => ipcRenderer.invoke("getCalendarEvents"),
  setCalendarURL: (url) => ipcRenderer.invoke("setCalendarURL", url)
})