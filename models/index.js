let users = {
  1: {
    id: '1',
    username: 'Kristen Mazza',
    admin: true,
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};

let posts = {
  1: {
    id: '1',
    title: 'Title1',
    content: 'Hello World',
    userId: '1',
    published: Date.now(),
  },
  2: {
    id: '2',
    title: 'Title2',
    content: 'By World',
    userId: '2',
    published: Date.now(),
  },
};

module.exports = {
  users,
  posts,
};
