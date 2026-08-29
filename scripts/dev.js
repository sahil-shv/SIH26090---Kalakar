// Root Dev Runner — Launches both Backend (port 3001) and Frontend (port 3000/5173)
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\n==================================================');
console.log('🚀 Starting SIH26090 AI Product Studio');
console.log('   - Backend:  http://localhost:3001');
console.log('   - Frontend: http://localhost:3000');
console.log('==================================================\n');

// Clean up any stale process occupying port 3001 prior to starting backend
if (isWindows) {
  try {
    const { execSync } = await import('child_process');
    execSync('powershell -Command "Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"', { stdio: 'ignore' });
  } catch (err) {
    // Ignore if no process on port 3001
  }
}

function runService(name, dir, prefixColor) {
  const proc = spawn(npmCmd, ['run', 'dev'], {
    cwd: path.join(rootDir, dir),
    stdio: 'pipe',
    shell: true
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`[${name}] ${line}`);
      }
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`[${name} ERROR] ${line}`);
      }
    });
  });

  proc.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  return proc;
}

const backendProc = runService('BACKEND', 'backend');
const frontendProc = runService('FRONTEND', 'frontend');

process.on('SIGINT', () => {
  console.log('\nShutting down backend and frontend services...');
  backendProc.kill();
  frontendProc.kill();
  process.exit(0);
});
