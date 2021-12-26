import HttpException from '@exceptions/HttpException';

class ServerException extends HttpException {
  /**
   * Returns a 500 for unexptected server exceptions
   * @param entity one of type entity
   * @param id identifier for entity if applicable
   */
  constructor(message: string) {
    const customMessage = message ? `! - ${message}`: '!';
    super(500, `Unexpected error occured${customMessage}`);
  }
}

export default ServerException;