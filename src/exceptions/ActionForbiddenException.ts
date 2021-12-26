import HttpException from '@exceptions/HttpException';

class ActionForbiddenException extends HttpException {
  constructor(message?: string) {
    const customMessage = message ? `! - ${message}`: '!';
    super(403, `Action Forbidden${customMessage}`);
  }
}

export default ActionForbiddenException;