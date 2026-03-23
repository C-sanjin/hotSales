const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkPort(port) {
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
    return output.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function startBackend() {
  const backendDir = path.join(__dirname, 'backend');
  console.log('Starting backend service...');
  
  const child = require('child_process').spawn('node', ['src/app.js'], {
    cwd: backendDir,
    detached: true,
    stdio: 'ignore'
  });
  
  child.unref();
  console.log('Backend service started in background');
}

function startFrontend() {
  const frontendDir = __dirname;
  console.log('Starting frontend service...');
  
  const child = require('child_process').spawn('npm', ['run', 'dev'], {
    cwd: frontendDir,
    detached: true,
    stdio: 'ignore'
  });
  
  child.unref();
  console.log('Frontend service started in background');
}

console.log('Checking service status...');

const backendRunning = checkPort(3006);
const frontendRunning = checkPort(3000);

console.log(`Backend (port 3006): ${backendRunning ? 'Running' : 'Not running'}`);
console.log(`Frontend (port 3000): ${frontendRunning ? 'Running' : 'Not running'}`);

if (!backendRunning) {
  startBackend();
}

if (!frontendRunning) {
  startFrontend();
}

console.log('Services check completed.');
console.log('Backend API: http://localhost:3006/api');
console.log('Frontend: http://localhost:3000/');
