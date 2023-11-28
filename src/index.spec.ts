import { server } from './index.js';

describe('test server from index.ts', () => {
  it('stop server without error', async () => {
    expect(server).toBeDefined();

    server.close();
  });
});
