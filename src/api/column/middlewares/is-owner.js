const { createOwnershipMiddleware } = require('../../utils/middleware-factory');

module.exports = createOwnershipMiddleware({
  uid: 'api::column.column',
  resourceName: 'Column',
  getOwner: {
    populate: { board_id: { populate: { user: true } } },
    extract: (column) => column.board_id?.user,
  },
});
