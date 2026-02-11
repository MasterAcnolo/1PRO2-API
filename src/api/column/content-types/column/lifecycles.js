const { getDocumentId } = require('../../../utils/helpers');

module.exports = {
  /**
   * Lifecycle hook: beforeDelete
   * 
   * Ce hook est déclenché AVANT la suppression d'une Column.
   * Il permet de supprimer en cascade toutes les Cards liées.
   * 
   * @param {Object} event - L'événement de suppression
   * @param {Object} event.params - Les paramètres de la suppression
   * @param {Object} event.params.where - Objet contenant les critères de suppression
   */
  async beforeDelete(event) {
    const { where } = event.params;
    
    strapi.log.info('Column beforeDelete where:', JSON.stringify(where));
    
    // Récupérer le documentId
    const columnDocumentId = await getDocumentId(where, 'api::column.column');

    if (!columnDocumentId) {
      strapi.log.warn('No documentId found for column deletion');
      return;
    }

    strapi.log.info(`Starting cascade delete for column ${columnDocumentId}`);

    try {
      // Récupérer toutes les Cards liées à cette Column
      const cards = await strapi.documents('api::card.card').findMany({
        filters: {
          column: {
            documentId: {
              $eq: columnDocumentId,
            },
          },
        },
      });

      strapi.log.info(`Found ${cards.length} cards to delete for column ${columnDocumentId}`);

      // Supprimer toutes les Cards
      for (const card of cards) {
        await strapi.documents('api::card.card').delete({
          documentId: card.documentId,
        });
      }

      // La Column sera supprimée automatiquement après ce hook
      strapi.log.info(`Cascade delete for column ${columnDocumentId}: ${cards.length} cards deleted`);
    } catch (error) {
      strapi.log.error(`Error during cascade delete for column ${columnDocumentId}:`, error);
      throw error;
    }
  },
};
