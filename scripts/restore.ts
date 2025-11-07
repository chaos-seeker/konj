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

const backupFile = process.argv[2];

if (!backupFile) {
  console.error('Error: Backup file path is required');
  console.error('Usage: pnpm restore <path-to-backup-file>');
  console.error('Example: pnpm restore backups/2024-01-15_14-30-00/full_backup.dump');
  process.exit(1);
}

if (!fs.existsSync(backupFile)) {
  console.error(`Error: Backup file not found: ${backupFile}`);
  process.exit(1);
}

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

async function restoreDatabase(): Promise<void> {
  try {
    console.log('Starting database restore...');
    console.log('─'.repeat(50));
    console.log(`Database URL: ${DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'N/A'}`);
    console.log(`Backup file: ${backupFile}`);
    console.log('');
    console.log('⚠️  WARNING: This will overwrite the existing database!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    console.log('');

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const useDocker = checkCommand('docker');
    const hasPgRestore = checkCommand('pg_restore');

    let command: string;
    const backupDir = path.dirname(backupFile);
    const backupFileName = path.basename(backupFile);

    if (hasPgRestore) {
      console.log('Using local pg_restore...');
      command = `pg_restore --dbname="${DATABASE_URL}" --no-owner --no-acl --clean --if-exists "${backupFile}"`;
    } else if (useDocker) {
      console.log('Using Docker pg_restore...');
      if (!DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
      }
      const dbUrl = new URL(DATABASE_URL);
      const dbName = dbUrl.pathname.slice(1);
      const dbHost = dbUrl.hostname;
      const dbPort = dbUrl.port || '5432';
      const dbUser = dbUrl.username;
      const dbPassword = dbUrl.password;

      command = `docker run --rm -v "${backupDir}:/backup" -e PGPASSWORD="${dbPassword}" postgres:15 pg_restore -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} --no-owner --no-acl --clean --if-exists /backup/${backupFileName}`;
    } else {
      console.error(
        'Error: pg_restore is not installed and Docker is not available',
      );
      console.error('Please install PostgreSQL client tools or Docker');
      process.exit(1);
    }

    console.log('Restoring database from backup...');
    execSync(command, {
      stdio: 'inherit',
    });

    console.log('Database restored successfully!');
  } catch (error: any) {
    console.error('Error restoring database:', error.message);
    console.error('Make sure pg_restore is installed or Docker is available');
    process.exit(1);
  }
}

async function main() {
  await restoreDatabase();
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

