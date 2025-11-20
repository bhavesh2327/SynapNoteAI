import dotenv from 'dotenv';
import fs from 'fs';
console.log('cwd:', process.cwd());
console.log('.env exists:', fs.existsSync('.env'));
const result = dotenv.config();
console.log('dotenv result:', result);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('All keys count:', Object.keys(process.env).length);
