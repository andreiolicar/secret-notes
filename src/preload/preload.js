const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Vault operations
    vault: {
        isFirstTime: () => ipcRenderer.invoke('vault:is-first-time'),
        create: (password) => ipcRenderer.invoke('vault:create', password),
        unlock: (password) => ipcRenderer.invoke('vault:unlock', password),
    },

    // Notes operations
    notes: {
        list: () => ipcRenderer.invoke('notes:list'),
        get: (noteId, notePassword = null) => ipcRenderer.invoke('notes:get', noteId, notePassword),
        create: (data) => ipcRenderer.invoke('notes:create', data),
        update: (noteId, updates, notePassword = null) => ipcRenderer.invoke('notes:update', noteId, updates, notePassword),
        delete: (noteId) => ipcRenderer.invoke('notes:delete', noteId),
        unlock: (noteId, password) => ipcRenderer.invoke('notes:unlock', noteId, password),
        search: (query) => ipcRenderer.invoke('notes:search', query),
    },
});