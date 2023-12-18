import { createApp } from './app.js';
import dotenv from 'dotenv';
import { client } from './infrastructure/database/mongodb/index.js';

dotenv.config({});

export async function startServer() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const app = createApp();
    const port = process.env.PORT || 3000;

    const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

    // Handle server shutdown (e.g., on process termination)
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      server.close(async () => {
        console.log('HTTP server closed.');
        await client.close();
        console.log('MongoDB disconnected.');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process with an error code
  }
}

// Start the server
startServer();
