const { getDocumentId } = require('../../../utils/helpers');

module.exports = {
  /**
   * Lifecycle hook: beforeDelete
   * 
   * Ce hook est déclenché AVANT la suppression d'un Board.
   * Il permet de supprimer en cascade toutes les Columns et Cards liées.
   * 
   * @param {Object} event - L'événement de suppression
   * @param {Object} event.params - Les paramètres de la suppression
   * @param {Object} event.params.where - Objet contenant les critères de suppression
   */
  async beforeDelete(event) {
    const { where } = event.params;
    
    strapi.log.info('Board beforeDelete where:', JSON.stringify(where));
    
    // Récupérer le documentId
    const boardDocumentId = await getDocumentId(where, 'api::board.board');

    if (!boardDocumentId) {
      strapi.log.warn('No documentId found for board deletion');
      return;
    }

    strapi.log.info(`Starting cascade delete for board ${boardDocumentId}`);

    try {
      // Récupérer toutes les Columns liées à ce Board
      const columns = await strapi.documents('api::column.column').findMany({
        filters: {
          board_id: {
            documentId: {
              $eq: boardDocumentId,
            },
          },
        },
      });

      strapi.log.info(`Found ${columns.length} columns to delete`);

      let totalCards = 0;

      // Pour chaque Column, supprimer toutes les Cards liées
      for (const column of columns) {
        // Récupérer toutes les Cards de cette Column
        const cards = await strapi.documents('api::card.card').findMany({
          filters: {
            column: {
              documentId: {
                $eq: column.documentId,
              },
            },
          },
        });

        strapi.log.info(`Found ${cards.length} cards in column ${column.documentId}`);

        // Supprimer toutes les Cards
        for (const card of cards) {
          await strapi.documents('api::card.card').delete({
            documentId: card.documentId,
          });
          totalCards++;
        }

        // Supprimer la Column
        await strapi.documents('api::column.column').delete({
          documentId: column.documentId,
        });
      }

      // Le Board sera supprimé automatiquement après ce hook
      strapi.log.info(`Cascade delete completed for board ${boardDocumentId}: ${columns.length} columns and ${totalCards} cards deleted`);
    } catch (error) {
      strapi.log.error(`Error during cascade delete for board ${boardDocumentId}:`, error);
      throw error;
    }
  },
};
