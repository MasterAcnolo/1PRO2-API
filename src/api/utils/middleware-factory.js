/**
 * Factory pour créer un middleware de vérification de propriété
 * 
 * @param {Object} options - Options de configuration
 * @param {string} options.uid - L'UID de l'entité (ex: 'api::board.board')
 * @param {string} options.resourceName - Le nom de la ressource pour les messages
 * @param {Function|Object} options.getOwner - Fonction ou objet pour récupérer l'owner
 * @returns {Function} Le middleware configuré
 */
function createOwnershipMiddleware({ uid, resourceName, getOwner }) {
  return (config, { strapi }) => async (ctx, next) => {
    const user = ctx.state.user;
    const id = ctx.params.id;

    if (!user) {
      return ctx.unauthorized("Authentication required.");
    }

    if (!id) {
      return ctx.badRequest("Missing resource documentId.");
    }

    // Déterminer le populate et la fonction d'extraction
    const isFunction = typeof getOwner === 'function';
    const populate = isFunction ? { user: true } : getOwner.populate;
    const extractOwner = isFunction ? getOwner : getOwner.extract;

    // Récupérer l'entité avec populate
    const [entity] = await strapi.entityService.findMany(uid, {
      filters: { documentId: id },
      populate,
    });

    if (!entity) {
      return ctx.notFound(`${resourceName} not found.`);
    }

    // Vérifier la propriété
    const owner = extractOwner(entity);
    if (!owner) {
      return ctx.badRequest(`${resourceName} has no owner or invalid ownership chain.`);
    }

    if (String(owner.id) !== String(user.id)) {
      return ctx.forbidden("You do not own this resource.");
    }

    await next();
  };
}

module.exports = {
  createOwnershipMiddleware,
};
