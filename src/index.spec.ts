import { client } from './infrastructure/database/mongodb/index.js';

// Mock the MongoDB client
jest.mock('./infrastructure/database/mongodb/index.js', () => ({
  client: {
    connect: jest.fn(),
    close: jest.fn(),
  },
}));

// Mock the server listen function
const mockListen = jest.fn();
jest.mock('./app.js', () => ({
  createApp: () => ({
    listen: mockListen,
  }),
}));

describe('Server Start', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to MongoDB and start the server', async () => {
    await require('./index.js'); // Path to your main server file

    expect(client.connect).toHaveBeenCalled();
    expect(mockListen).toHaveBeenCalled();
  });
});
