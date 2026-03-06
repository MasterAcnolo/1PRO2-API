'use strict';

/**
 * column controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::column.column', ({ strapi }) => ({
	async create(ctx) {
		const user = ctx.state.user;
		const boardId = ctx.request.body?.data?.board_id;
		if (!user || !boardId) {
			return ctx.unauthorized("Authentication required ou board_id manquant.");
		}
		// Recherche board par id ou documentId
		const board = await strapi.entityService.findMany('api::board.board', {
			filters: {
				$or: [
					{ id: boardId },
					{ documentId: boardId }
				]
			},
			populate: { user: true }
		}).then(arr => arr[0]);
		if (!board) return ctx.notFound("Board introuvable.");
		if (board.user?.id !== user.id) return ctx.forbidden("Ce board ne vous appartient pas.");
		return await super.create(ctx);
	}
}));
