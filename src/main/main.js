import { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerIpcHandlers, clearSession } from './ipcHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Criar janela principal
function createWindow() {
    // Se janela já existe, apenas mostrar
    if (mainWindow !== null) {
        showWindow();
        return;
    }

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        frame: true,
        backgroundColor: '#000000',
        show: false, // Não mostrar imediatamente
        center: true, // Centralizar na tela
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    // Remover menu completamente
    mainWindow.setMenuBarVisibility(false);

    // Modo desenvolvimento, carregar do servidor Vite
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Produção: carregar arquivo compilado
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }

    // Mostrar janela com fade in quando estiver pronta
    mainWindow.once('ready-to-show', () => {
        showWindow();
    });

    // Prevenir fechamento completo, minimizar para tray
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            hideWindow();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    console.log('✅ Janela criada');
}

// Mostrar janela com animação
function showWindow() {
    if (mainWindow === null) {
        createWindow();
        return;
    }

    // Restaurar se minimizada
    if (mainWindow.isMinimized()) {
        mainWindow.restore();
    }

    // Mostrar e focar
    mainWindow.show();
    mainWindow.focus();

    // Animação fade in (opacidade)
    if (process.platform === 'win32') {
        mainWindow.setOpacity(0);
        mainWindow.show();

        let opacity = 0;
        const fadeIn = setInterval(() => {
            opacity += 0.1;
            if (opacity >= 1) {
                mainWindow.setOpacity(1);
                clearInterval(fadeIn);
            } else {
                mainWindow.setOpacity(opacity);
            }
        }, 20);
    }

    console.log('👁️ Janela mostrada');
}

// Ocultar janela (minimizar para tray)
function hideWindow() {
    if (mainWindow !== null) {
        mainWindow.hide();
        console.log('🙈 Janela oculta');
    }
}

// Registrar atalho global
function registerGlobalShortcut() {
    const shortcut = 'CommandOrControl+Alt+Shift+N';

    const registered = globalShortcut.register(shortcut, () => {
        console.log('⌨️ Atalho global ativado');

        if (mainWindow === null) {
            // Janela foi destruída, criar nova
            createWindow();
        } else if (mainWindow.isVisible()) {
            // Janela visível, apenas focar
            mainWindow.focus();
        } else {
            // Janela oculta, mostrar
            showWindow();
        }
    });

    if (registered) {
        console.log(`✅ Atalho global registrado: ${shortcut}`);
    } else {
        console.error('❌ Falha ao registrar atalho global');
    }
}

// Criar system tray
function createTray() {
    // Criar ícone do tray (por enquanto usa o ícone padrão do Electron ou um vazio)
    // Substituir por um ícone customizado depois
    const icon = nativeImage.createFromPath(
        path.join(__dirname, '../../public/icon.png')
    ).resize({ width: 16, height: 16 });

    tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);

    // Tooltip
    tray.setToolTip('SecretNotes - Ctrl+Alt+Shift+N para abrir');

    // Menu de contexto
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir SecretNotes',
            click: () => {
                showWindow();
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Atalho: Ctrl+Alt+Shift+N',
            enabled: false,
        },
        {
            type: 'separator',
        },
        {
            label: 'Sair',
            click: () => {
                isQuitting = true;
                app.quit();
            },
        },
    ]);

    tray.setContextMenu(contextMenu);

    // Clicar no ícone também abre o app
    tray.on('click', () => {
        showWindow();
    });

    console.log('✅ System tray criado');
}

// Inicialização do app
app.whenReady().then(async () => {
    // Registrar handlers IPC
    registerIpcHandlers();

    // Criar system tray
    createTray();

    // Registrar atalho global
    registerGlobalShortcut();

    // Criar janela inicial
    createWindow();

    // macOS: recriar janela se não houver nenhuma
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else {
            showWindow();
        }
    });
});

// Não fechar o app ao fechar todas as janelas, manter rodando em background para o atalho global funcionar
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // No Windows/Linux, mantém rodando em background
        console.log('⚙️ Todas as janelas fechadas, mas app continua rodando');
    }
});

// Antes de sair, limpar recursos
app.on('before-quit', () => {
    isQuitting = true;
});

app.on('will-quit', () => {
    // Desregistrar atalhos
    globalShortcut.unregisterAll();

    // Limpar sessão de segurança
    clearSession();

    console.log('👋 App encerrando');
});

// Prevenir múltiplas instâncias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    // Já existe uma instância rodando
    app.quit();
} else {
    // Segunda instância tentou abrir, focar na primeira
    app.on('second-instance', () => {
        if (mainWindow !== null) {
            showWindow();
        }
    });
}