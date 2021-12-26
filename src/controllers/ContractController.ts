import { Router, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Controller from '@interfaces/Controller';
import RequestWithProfile from '@interfaces/RequestWithProfile';
import { getProfile } from '@middlewares/GetProfile';
import EntityNotFoundException from '@exceptions/EntityNotFoundException';


class ContractController implements Controller {
  public path = '/contracts';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, [getProfile], this.getUserContractById);
    this.router.get(`${this.path}`, [getProfile], this.getAllActiveUserContracts);
  }

  /**
   * getUserContractById fetches contract belonging to user by it's id
   * @param request express request - user must pass profile_id header
   * @param response express response
   * @param next 
   */
  private async getUserContractById (request: RequestWithProfile, response: Response, next: NextFunction) {
    const {Contract} = request.app.get('models')
    const {id} = request.params
    const profile = request.profile;
    const contract = await Contract.findOne({where: {
        [Op.and]: {
            id,
            [Op.or]: {
                ContractorId: profile.id,
                ClientId: profile.id
            }
        }
    }})
    if(!contract)  return next(new EntityNotFoundException("Contract", id));
    return response.json(contract)
  }

  /**
   * Gets all active contracts for a user
   * @param request express request - user must pass profile_id header
   * @param response express response
   * @param next 
   * @returns 
   */
  private async getAllActiveUserContracts (request: RequestWithProfile, response: Response, next: NextFunction) {
    const {Contract} = request.app.get('models')
    const profile = request.profile
    const contracts = await Contract.findAll({where: {
        [Op.and]: {
            [Op.or]: {
                ContractorId: profile.id,
                ClientId: profile.id
            },
            status: {
                [Op.not]: 'terminated'
            }
        }
    }})
    if(contracts.length == 0) return next(new EntityNotFoundException("Contract"));
    return response.json(contracts)
  }
}

export default ContractController;