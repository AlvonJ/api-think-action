import { AddressInfo } from 'net';
import { createApp } from './app.js';

describe('Express App', () => {
  const port = 3001;

  it('server should start on port 3001', async () => {
    const app = createApp();

    const server = app.listen(port);

    const { port: portServer } = server.address() as AddressInfo;

    expect(portServer).toEqual(port);

    server.close();
  });

  it('not listening server should return null', async () => {
    const app = createApp();

    const server = app.listen(3001);

    server.close();

    expect(server.address()).toEqual(null);
  });
});
