import { execSync } from 'child_process';
import * as fs from 'fs';
import { createRequire } from 'module';
import * as path from 'path';

const require = createRequire(import.meta.url);

const envPath = path.join(process.cwd(), '.env.local');
const envPathAlt = path.join(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else if (fs.existsSync(envPathAlt)) {
  require('dotenv').config({ path: envPathAlt });
} else {
  try {
    require('dotenv').config();
  } catch {}
}

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL must be set in .env file');
  console.error('Available env vars:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
    SUPABASE_DB_URL: process.env.SUPABASE_DB_URL ? 'set' : 'not set',
    POSTGRES_URL: process.env.POSTGRES_URL ? 'set' : 'not set',
  });
  process.exit(1);
}

const timestamp =
  new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] +
  '_' +
  new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const backupDir = path.join(process.cwd(), 'backups', timestamp);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log(`Backup directory created: ${backupDir}`);

function checkCommand(command: string): boolean {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execSync(`where ${command}`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

async function backupDatabase(): Promise<void> {
  try {
    console.log('Starting database backup with pg_dump...');
    console.log('─'.repeat(50));

    const backupFile = path.join(backupDir, 'full_backup.dump');

    let command: string;
    const useDocker = checkCommand('docker');
    const hasPgDump = checkCommand('pg_dump');

    if (hasPgDump) {
      console.log('Using local pg_dump...');
      command = `pg_dump "${DATABASE_URL}" --format=custom --no-owner --no-acl -f "${backupFile}"`;
    } else if (useDocker) {
      console.log('Using Docker pg_dump...');
      if (!DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
      }
      const dbUrl = new URL(DATABASE_URL);
      const dbName = dbUrl.pathname.slice(1);
      const dbHost = dbUrl.hostname;
      const dbPort = dbUrl.port || '5432';
      const dbUser = dbUrl.username;
      const dbPassword = dbUrl.password;

      command = `docker run --rm -v "${backupDir}:/backup" -e PGPASSWORD="${dbPassword}" postgres:15 pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} --format=custom --no-owner --no-acl -f /backup/full_backup.dump`;
    } else {
      console.error(
        'Error: pg_dump is not installed and Docker is not available',
      );
      console.error('Please install PostgreSQL client tools or Docker');
      console.error(
        'Windows: Download from https://www.postgresql.org/download/windows/',
      );
      console.error(
        'Or install Docker: https://www.docker.com/products/docker-desktop',
      );
      process.exit(1);
    }

    console.log('Creating custom format dump...');
    execSync(command, {
      stdio: 'inherit',
    });

    if (!fs.existsSync(backupFile)) {
      throw new Error('Backup file was not created');
    }

    const stats = fs.statSync(backupFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`Backup created successfully: ${backupFile}`);
    console.log(`Backup file size: ${fileSizeMB} MB`);
  } catch (error: any) {
    console.error('Error creating database backup:', error.message);
    console.error('Make sure pg_dump is installed or Docker is available');
    process.exit(1);
  }
}

async function main() {
  console.log('Starting database backup...\n');
  await backupDatabase();

  const backupInfo = {
    timestamp: new Date().toISOString(),
    databaseUrl: DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'N/A',
    backupDirectory: backupDir,
    backupFile: 'full_backup.dump',
    backupFiles: fs.readdirSync(backupDir),
  };

  fs.writeFileSync(
    path.join(backupDir, 'backup-info.json'),
    JSON.stringify(backupInfo, null, 2),
    'utf-8',
  );

  console.log('\nBackup completed successfully!');
  console.log(`Backup location: ${backupDir}`);
  console.log(`Backup file: ${path.join(backupDir, 'full_backup.dump')}`);
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
