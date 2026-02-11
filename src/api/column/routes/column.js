'use strict';

/**
 * column router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::column.column', {
  config: {
    findOne: {
      middlewares: ["api::column.is-owner"],
    },
    update: {
      middlewares: ["api::column.is-owner"],
    },
    delete: {
      middlewares: ["api::column.is-owner"],
    },
  },
});
