import { createApp } from './app.js';
import dotenv from 'dotenv';

dotenv.config({});

const app = createApp();
const port = process.env.PORT || 3000;

export const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
