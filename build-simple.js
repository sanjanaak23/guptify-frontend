const { execSync } = require('child_process');

console.log('🚀 Starting simple Guptify build for Vercel...');

try {
  console.log('📦 Current directory:', process.cwd());
  console.log('📋 Package.json exists:', require('fs').existsSync('package.json'));
  
  // Use npx which should handle permissions better
  console.log('🏗️ Running build with npx...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}