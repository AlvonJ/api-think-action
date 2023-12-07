export async function createFakeNotification() {
  const data = [
    {
      _id: '656f26db866ff2a4d71a9b86',
      type: 'request',
      message: 'user3 wants to support you',
      status: 'pending',
      date: new Date(),
    },
    {
      _id: '65705617d6202602897c78b1',
      type: 'message',
      message: 'User 1 like your post',
      date: new Date(new Date(new Date().setDate(new Date().getDate() - 1))),
    },
    {
      _id: '656f3128b39ae757f78678f1',
      type: 'message',
      message: 'User 2 like your post',
      date: new Date(),
    },
  ];
}
