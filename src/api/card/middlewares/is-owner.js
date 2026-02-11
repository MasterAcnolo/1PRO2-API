const { createOwnershipMiddleware } = require('../../utils/middleware-factory');

module.exports = createOwnershipMiddleware({
  uid: 'api::card.card',
  resourceName: 'Card',
  getOwner: {
    populate: { column: { populate: { board_id: { populate: { user: true } } } } },
    extract: (card) => card.column?.board_id?.user,
  },
});
