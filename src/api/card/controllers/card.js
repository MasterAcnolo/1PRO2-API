'use strict';

/**
 * card controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::card.card', ({ strapi }) => ({
	async create(ctx) {
		const user = ctx.state.user;
		const columnId = ctx.request.body?.data?.column;
		if (!user || !columnId) {
			return ctx.unauthorized("Authentication required ou column manquant.");
		}
		// Recherche colonne par id ou documentId
		const column = await strapi.entityService.findMany('api::column.column', {
			filters: {
				$or: [
					{ id: columnId },
					{ documentId: columnId }
				]
			},
			populate: { board_id: { populate: { user: true } } }
		}).then(arr => arr[0]);
		if (!column) return ctx.notFound("Colonne introuvable.");
		const board = column.board_id;
		if (!board || board.user?.id !== user.id) return ctx.forbidden("Ce board ne vous appartient pas.");
		return await super.create(ctx);
	}
}));
