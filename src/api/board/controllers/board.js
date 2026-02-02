'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::board.board', ({ strapi }) => ({
	async find(ctx) {
		const user = ctx.state.user;
		if (!user) {
			return ctx.unauthorized("Authentication required.");
		}
		// Filtrer les boards par user.id
		ctx.query = {
			...ctx.query,
			filters: {
				...(typeof ctx.query.filters === 'object' && ctx.query.filters !== null ? ctx.query.filters : {}),
				user: user.id,
			},
		};
		// Appel du find standard avec le filtre
		return await super.find(ctx);
	},
}));