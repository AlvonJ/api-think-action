export async function createFakePost() {
  const data = [
    {
      _id: '656f2ced6b61426bb1923292',
      userId: '656f261a40adaa0c43b3e679',
      categoryResolutionId: '656f26db866ff2a4d71a9b86',
      type: 'resolutions',
      caption: 'This is resolution for post 1',
      photo: ['photo1.png'],
      like: [
        '656f261a40adaa0c43b3e679',
        '656f26663094a2fe958943b4',
        '656f266de12a3289f1398ea9',
        '656f26d2b93ef5dd1a5c953d',
      ],
      dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      createdDate: new Date(),
      updatedDate: null,
      shareWith: 'everyone',
      isComplete: false,
    },
    {
      _id: '65703a6d4da8360e96f5b2f2',
      userId: '656f261a40adaa0c43b3e679',
      categoryResolutionId: '656f26db866ff2a4d71a9b86',
      type: 'weeklyGoals',
      caption: 'This is weekly goals for post 1',
      photo: ['photo1.png'],
      like: [],
      dueDate: new Date(new Date(new Date().setDate(new Date().getDate() + 8))),
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 1))),
      updatedDate: null,
      shareWith: 'supporter',
      isComplete: false,
    },
    {
      _id: '656f34311fe90d6212e6b676',
      userId: '656f26663094a2fe958943b4',
      categoryResolutionId: '656f29a2198443d135af03d6',
      type: 'resolutions',
      caption: 'This is resolution for post 2',
      photo: ['photo1.png'],
      like: ['656f261a40adaa0c43b3e679'],
      dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 2))),
      updatedDate: null,
      shareWith: 'supporter',
      isComplete: false,
    },
    {
      _id: '656f344f4a52cbd796057dd1',
      userId: '656f26663094a2fe958943b4',
      categoryResolutionId: '656f29a2198443d135af03d6',
      type: 'weeklyGoals',
      caption: 'This is weekly goal for post 2',
      photo: ['photo2.png'],
      like: [],
      dueDate: new Date(new Date(new Date().setDate(new Date().getDate() + 10))),
      createdDate: new Date(new Date(new Date().setDate(new Date().getDate() + 3))),
      updatedDate: null,
      shareWith: 'private',
      isComplete: false,
    },
  ];
}
