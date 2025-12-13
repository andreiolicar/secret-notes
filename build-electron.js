const { build } = require('vite');
const { build: electronBuild } = require('electron-builder');
const path = require('path');
const fs = require('fs-extra');

async function buildApp() {
    console.log('📦 Building renderer process...');
    await build();

    console.log('📦 Copying main and preload files...');
    await fs.ensureDir('dist-electron/main');
    await fs.ensureDir('dist-electron/preload');

    await fs.copy('src/main/main.js', 'dist-electron/main/main.js');
    await fs.copy('src/preload/preload.js', 'dist-electron/preload/preload.js');

    console.log('✅ Build complete!');
}

buildApp().catch(console.error);