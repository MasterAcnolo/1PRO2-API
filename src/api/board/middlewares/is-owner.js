const { createOwnershipMiddleware } = require('../../utils/middleware-factory');

module.exports = createOwnershipMiddleware({
  uid: 'api::board.board',
  resourceName: 'Board',
  getOwner: (board) => board.user,
});
