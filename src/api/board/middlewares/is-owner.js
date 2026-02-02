module.exports = (config, { strapi }) => async (ctx, next) => {
  const user = ctx.state.user;
  const id = ctx.params.id;

  if (!user) {
    return ctx.unauthorized("Authentication required.");
  }

  if (!id) {
    return ctx.badRequest("Missing resource documentId.");
  }

  const [board] = await strapi.entityService.findMany(
    "api::board.board",
    {
      filters: { documentId: id },
      populate: { user: true },
    }
  );

  if (!board) {
    return ctx.notFound("Board not found.");
  }

  if (!board.user || String(board.user.id) !== String(user.id)) {
    return ctx.forbidden("You do not own this resource.");
  }

  await next();
};
