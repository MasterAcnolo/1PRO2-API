'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::board.board', ({ strapi }) => ({
  async create(params) {
    const ctx = strapi.requestContext.get();
    const user = ctx?.state?.user;

    strapi.log.info('Current user in Board service:', user?.id || 'none');
    
    if (!user) {
      throw new Error('You must be authenticated to create a board');
    }

    // Get incoming data
    const data = params?.data || {};

    // Call core create and inject the relation
    const result = await super.create({
      ...params,
      data: {
        ...data,
        user: {
          // use documentId as shown in relations/documentId docs
          connect: [user.documentId],
        },
      },
    });

    return result;
  },
}));
