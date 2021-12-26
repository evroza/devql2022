import { Router, Response, NextFunction } from 'express';
import Controller from '@interfaces/Controller';
import RequestWithProfile from '@interfaces/RequestWithProfile';
import { getProfile } from '@middlewares/GetProfile';
import ActionForbiddenException from '@exceptions/ActionForbiddenException';
import NotAuthorizedException from '@exceptions/NotAuthorizedException';
import { sequelize } from '@models/model';
import ServerException from '@exceptions/ServerErrorException';
import { literal } from 'sequelize';


class BalanceController implements Controller {
  public path = '/balances';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/deposit/:userId`, [getProfile], this.deposit);
  }

  /**
   * deposit Allows client to deposit into his balance
   * Can't deposit more than 25% of total jobs to pay at deposit time
   * @param request express request - user must pass profile_id header
   * @param response express response
   * @param next 
   */
  private async deposit(request: RequestWithProfile, response: Response, next: NextFunction) {
    const { Profile, Contract, Job } = request.app.get('models')
    const { userId } = request.params
    const profile = request.profile;
    const { amount } = request.body;

    if (profile.id != Number(userId)) {
      return next(new ActionForbiddenException("Cannot deposit into someone else's balance"));
    }
    if (profile.type !== 'client') {
      return next(new NotAuthorizedException("Only clients can deposit"))
    }

    const depositResponse = {
      amount,
      clientId: userId,
      success: false
    }
    
    try {
      await sequelize.transaction(async (t) => {
        const clientUnpaidTotal = await Profile.sum('price', {
          include: {
            model: Contract,
            as: 'Client',
            where: {
              ClientId: userId
            },
            include: [{
              model: Job,
              as: 'Contracts',
              where: {
                paid: 0
              }
            }]
          },
        })

        console.log(">>>>>>>>>>>>>>", amount, clientUnpaidTotal)

        if (amount > (0.25 * clientUnpaidTotal)) {
          return next(new ActionForbiddenException("Amount too big, can only deposit less than 25% of unpaid balances"));
        }

        await Profile.update({
          balance: literal(`balance + ${amount}`)
        }, {
          where: {
            id: userId
          }
        })

        depositResponse.success = true;
      });

      if(!response.headersSent) return response.json(depositResponse)
    } catch (error) {
      // Transaction failed already rolled back
      return next(new ServerException(error));
    }
  }
}

export default BalanceController;