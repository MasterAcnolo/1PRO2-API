const { getDocumentId } = require('../../api/utils/helpers');

module.exports = (plugin) => {
  // Enregistrer le lifecycle beforeDelete pour User
  const originalContentTypes = plugin.contentTypes;
  
  if (originalContentTypes && originalContentTypes.user) {
    originalContentTypes.user.lifecycles = {
      async beforeDelete(event) {
        const { where } = event.params;
        
        strapi.log.info('User beforeDelete where:', JSON.stringify(where));
        
        // Récupérer le documentId
        const userDocumentId = await getDocumentId(where, 'plugin::users-permissions.user');

        if (!userDocumentId) {
          strapi.log.warn('No documentId found for user deletion');
          return;
        }

        strapi.log.info(`Starting cascade delete for user ${userDocumentId}`);

        try {
          // Récupérer tous les Boards liés à ce User
          strapi.log.info(`Searching for boards with user documentId: ${userDocumentId}`);
          
          const boards = await strapi.documents('api::board.board').findMany({
            filters: {
              user: {
                documentId: {
                  $eq: userDocumentId,
                },
              },
            },
          });

          strapi.log.info(`Found ${boards.length} boards to delete`);
          
          if (boards.length > 0) {
            strapi.log.info(`Board IDs: ${boards.map(b => b.documentId).join(', ')}`);
          }

          // Supprimer tous les Boards (les lifecycles de Board, Column s'occuperont du reste)
          for (const board of boards) {
            strapi.log.info(`Deleting board ${board.documentId}`);
            await strapi.documents('api::board.board').delete({
              documentId: board.documentId,
            });
          }

          // Le User sera supprimé automatiquement après ce hook
          strapi.log.info(
            `Cascade delete completed for user ${userDocumentId}: ${boards.length} boards deleted`
          );
        } catch (error) {
          strapi.log.error(`Error during cascade delete for user ${userDocumentId}:`, error);
          throw error;
        }
      },
    };
  }

  return plugin;
};
