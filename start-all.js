const { spawn } = require('child_process');
const path = require('path');

console.log('Starting services...');

// 启动后端服务
const backendDir = path.join(__dirname, 'backend');
console.log('Starting backend service...');
const backend = spawn('node', ['src/app.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: false
});

backend.on('error', (err) => {
  console.error('Failed to start backend:', err);
});

backend.on('close', (code) => {
  console.log(`Backend service exited with code ${code}`);
});

// 等待2秒后启动前端服务
setTimeout(() => {
  console.log('Starting frontend service...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: false
  });

  frontend.on('error', (err) => {
    console.error('Failed to start frontend:', err);
  });

  frontend.on('close', (code) => {
    console.log(`Frontend service exited with code ${code}`);
  });
}, 2000);

console.log('Services starting...');
console.log('Backend API: http://localhost:3006/api');
console.log('Frontend: http://localhost:5173/');