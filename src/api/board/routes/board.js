'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter("api::board.board", {
  config: {
    findOne: {
      middlewares: ["api::board.is-owner"],
    },
    update: {
      middlewares: ["api::board.is-owner"],
    },
    delete: {
      middlewares: ["api::board.is-owner"],
    },
  },
});
