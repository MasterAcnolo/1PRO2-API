/**
 * Récupère le documentId d'une entité à partir de l'objet where
 * 
 * @param {Object} where - L'objet where contenant documentId ou id
 * @param {string} uid - L'UID de l'entité (ex: 'api::board.board')
 * @returns {Promise<string|null>} Le documentId ou null si non trouvé
 */
async function getDocumentId(where, uid) {
  if (where.documentId) {
    return where.documentId;
  }
  
  if (where.id) {
    const entity = await strapi.documents(uid).findFirst({
      filters: { id: where.id },
    });
    return entity?.documentId || null;
  }
  
  return null;
}

module.exports = {
  getDocumentId,
};
