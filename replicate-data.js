import fs from 'fs';
import path from'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname,'src','data','data.json');
const destintation = path.join(__dirname, 'dist-electron','data', 'data.json');

fs.mkdirSync(path.dirname(destintation), {recursive:true});

fs.copyFileSync(source,destintation);
console.log('Data replicated');