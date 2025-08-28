import { getDB } from './db.js';
const db = await getDB();
await db.exec('VACUUM;');
console.log('Migration done.');
process.exit(0);
