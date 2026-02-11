'use strict';

/**
 * card router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::card.card', {
  config: {
    findOne: {
      middlewares: ["api::card.is-owner"],
    },
    update: {
      middlewares: ["api::card.is-owner"],
    },
    delete: {
      middlewares: ["api::card.is-owner"],
    },
  },
});
