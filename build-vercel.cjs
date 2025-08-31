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
  
  // Try multiple approaches to run the build
  console.log('🏗️ Attempting build...');
  
  let buildSuccess = false;
  
  // Method 1: Try using npx vite build
  try {
    console.log('🔧 Trying npx vite build...');
    execSync('npx vite build', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    buildSuccess = true;
    console.log('✅ Build completed successfully with npx!');
  } catch (error) {
    console.log('⚠️ npx vite build failed, trying alternative method...');
  }
  
  // Method 2: Try using node directly with vite binary
  if (!buildSuccess) {
    try {
      console.log('🔧 Trying direct node execution...');
      const vitePath = path.join('node_modules', 'vite', 'bin', 'vite.js');
      if (fs.existsSync(vitePath)) {
        execSync(`node "${vitePath}" build`, { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
        buildSuccess = true;
        console.log('✅ Build completed successfully with direct node execution!');
      }
    } catch (error) {
      console.log('⚠️ Direct node execution failed, trying npm run...');
    }
  }
  
  // Method 3: Try npm run build as last resort
  if (!buildSuccess) {
    try {
      console.log('🔧 Trying npm run build...');
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      buildSuccess = true;
      console.log('✅ Build completed successfully with npm run build!');
    } catch (error) {
      console.log('⚠️ npm run build failed...');
    }
  }
  
  if (!buildSuccess) {
    throw new Error('All build methods failed');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('📍 Error details:', error);
  process.exit(1);
}