#!/usr/bin/env node

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Starting Guptify build...');

const vitePath = join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const buildProcess = spawn('node', [vitePath, 'build'], {
  stdio: 'inherit',
  env: process.env
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Build completed successfully!');
  } else {
    console.error(`Build failed with code ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (err) => {
  console.error('Build error:', err);
  process.exit(1);
});