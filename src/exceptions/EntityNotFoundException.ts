import HttpException from '@exceptions/HttpException';

class EntityNotFoundException extends HttpException {
  /**
   * Returns a 404 for missing entities
   * @param entity one of type entity
   * @param id identifier for entity if applicable
   */
  constructor(entity: entity, id?: string) {
      const message = id ? `${entity} with id: ${id} not found`: `${entity}s not found`
      super(404, message);
  }
}

export default EntityNotFoundException;