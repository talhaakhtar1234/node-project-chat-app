const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function getCurrUser(id) {
  return users.find(user => user.id === id);
}

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function getAvailableRooms() {
  const rooms = [...new Set(users.map(user => user.room))];
  return rooms;
}

module.exports = {
  userJoin,
  getCurrUser,
  userLeave,
  getRoomUsers,
  getAvailableRooms
};
