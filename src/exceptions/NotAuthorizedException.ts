import HttpException from '@exceptions/HttpException';

class NotAuthorizedException extends HttpException {
   constructor(message?: string) {
       const customMessage = message ? `! - ${message}`: '!';
       super(401, `You're not authorized${customMessage}`);
  }
}

export default NotAuthorizedException;