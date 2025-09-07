import fs from 'fs';
import path from 'path';
import { Database } from './types';

const dbPath = path.resolve(__dirname, '../src/db.json');

export function readDB(): Database {
  const db = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(db);
}

export function writeDB(data: Database): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

