const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting robust Guptify build for Vercel...');
console.log('📦 Node version:', process.version);
console.log('📦 Platform:', process.platform);
console.log('📦 Architecture:', process.arch);

try {
  console.log('📦 Current directory:', process.cwd());
  console.log('📋 Package.json exists:', fs.existsSync('package.json'));
  
  // Check if we're in a Vercel environment
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
  console.log('🌐 Vercel environment:', isVercel);
  
  // Check node_modules and vite
  console.log('📁 node_modules exists:', fs.existsSync('node_modules'));
  const vitePath = path.join('node_modules', 'vite', 'bin', 'vite.js');
  console.log('🔧 Vite binary exists:', fs.existsSync(vitePath));
  
  if (fs.existsSync(vitePath)) {
    const stats = fs.statSync(vitePath);
    console.log('🔧 Vite binary permissions:', stats.mode.toString(8));
  }
  
  let buildSuccess = false;
  
  // Method 1: Try using npx (most reliable)
  if (!buildSuccess) {
    try {
      console.log('🔧 Method 1: Trying npx vite build...');
      execSync('npx vite build', { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'production' }
      });
      buildSuccess = true;
      console.log('✅ Build completed successfully with npx!');
    } catch (error) {
      console.log('⚠️ npx vite build failed:', error.message);
    }
  }
  
  // Method 2: Try using node directly with vite binary
  if (!buildSuccess && fs.existsSync(vitePath)) {
    try {
      console.log('🔧 Method 2: Trying direct node execution...');
      execSync(`node "${vitePath}" build`, { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'production' }
      });
      buildSuccess = true;
      console.log('✅ Build completed successfully with direct node execution!');
    } catch (error) {
      console.log('⚠️ Direct node execution failed:', error.message);
    }
  }
  
  // Method 3: Try using npm run build
  if (!buildSuccess) {
    try {
      console.log('🔧 Method 3: Trying npm run build...');
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'production' }
      });
      buildSuccess = true;
      console.log('✅ Build completed successfully with npm run build!');
    } catch (error) {
      console.log('⚠️ npm run build failed:', error.message);
    }
  }
  
  // Method 4: Try using yarn if available
  if (!buildSuccess && fs.existsSync('yarn.lock')) {
    try {
      console.log('🔧 Method 4: Trying yarn build...');
      execSync('yarn build', { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'production' }
      });
      buildSuccess = true;
      console.log('✅ Build completed successfully with yarn!');
    } catch (error) {
      console.log('⚠️ yarn build failed:', error.message);
    }
  }
  
  // Method 5: Try using pnpm if available
  if (!buildSuccess && fs.existsSync('pnpm-lock.yaml')) {
    try {
      console.log('🔧 Method 5: Trying pnpm build...');
      execSync('pnpm build', { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'production' }
      });
      buildSuccess = true;
      console.log('✅ Build completed successfully with pnpm!');
    } catch (error) {
      console.log('⚠️ pnpm build failed:', error.message);
    }
  }
  
  if (!buildSuccess) {
    throw new Error('All build methods failed. Check the logs above for specific error details.');
  }
  
  // Verify the build output
  if (fs.existsSync('dist')) {
    const distContents = fs.readdirSync('dist');
    console.log('📁 Build output directory contents:', distContents);
    console.log('✅ Build verification successful!');
  } else {
    console.log('⚠️ Warning: dist directory not found after build');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('📍 Error details:', error);
  
  // Provide helpful debugging information
  console.log('\n🔍 Debugging information:');
  console.log('- Current working directory:', process.cwd());
  console.log('- Node version:', process.version);
  console.log('- NPM version:', execSync('npm --version', { encoding: 'utf8' }).trim());
  console.log('- Environment variables:', Object.keys(process.env).filter(key => key.includes('VERCEL') || key.includes('NODE')));
  
  process.exit(1);
}