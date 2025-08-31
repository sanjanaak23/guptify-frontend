const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Guptify build for Vercel...');

try {
  // First, let's check what we have
  console.log('📦 Current directory:', process.cwd());
  console.log('📋 Package.json exists:', fs.existsSync('package.json'));
  
  // Read and show package.json name
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('📄 Project name:', pkg.name);
    console.log('📄 Project version:', pkg.version);
  }
  
  // Check if node_modules exists
  console.log('📁 node_modules exists:', fs.existsSync('node_modules'));
  
  // Check vite binary
  const vitePath = path.join('node_modules', 'vite', 'bin', 'vite.js');
  console.log('🔧 Vite binary exists:', fs.existsSync(vitePath));
  
  if (fs.existsSync(vitePath)) {
    const stats = fs.statSync(vitePath);
    console.log('🔧 Vite binary permissions:', stats.mode.toString(8));
  }
  
  // Try to run the build
  console.log('🏗️ Running build...');
  execSync('node node_modules/vite/bin/vite.js build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('📍 Error details:', error);
  process.exit(1);
}