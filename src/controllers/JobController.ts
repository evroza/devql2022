import { Router, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Controller from '@interfaces/Controller';
import RequestWithProfile from '@interfaces/RequestWithProfile';
import { getProfile } from '@middlewares/GetProfile';
import EntityNotFoundException from '@exceptions/EntityNotFoundException';
import NotAuthorizedException from '@exceptions/NotAuthorizedException';
import ActionForbiddenException from '@exceptions/ActionForbiddenException';
import { sequelize } from '@models/model';
import ServerException from '@exceptions/ServerErrorException';


class JobController implements Controller {
    public path = '/jobs';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/unpaid`, [getProfile], this.getUserUpaidJobs);
        this.router.post(`${this.path}/:job_id/pay`, [getProfile], this.pay);
    }

    /**
     * getUserUpaidJobs Returns all unpaid jobs for user for active contracts
     * TODO: Maybe remove the contract from the final return of the job
     * @param request express request - user must pass profile_id header
     * @param response express response
     * @param next 
    */
    private async getUserUpaidJobs(request: RequestWithProfile, response: Response, next: NextFunction) {
        const profile = request.profile;

        const { Job, Contract } = request.app.get('models');
        const jobs = await Job.findAll({
            include: {
                model: Contract,
                where: {
                    [Op.and]: {
                        status: 'in_progress',
                        [Op.or]: {
                            ContractorId: profile.id,
                            ClientId: profile.id
                        }
                    }
                }
            },
            where: {
                paid: 0,
            }
        })

        if (jobs.length == 0) return next(new EntityNotFoundException('Job'));
        return response.json(jobs);
    }

    /**
     * Allows client to pay for job if his balance is greater than job value and jobId
     * NB!!!! Potential bug here, since check balance of client not part of transaction, no locking occurs and thus if two processes work with same entity then will end up with inconsistencies in balance
     * @param request express request - user must pass profile_id header
     * @param response express response
     * @param next 
     * @returns { success: bool, amount_transfered: number }
     */
    private async pay(request: RequestWithProfile, response: Response, next: NextFunction) {
        const { job_id: jobId } = request.params;

        const profile = request.profile
        if (profile.type !== "client") {
            return next(new NotAuthorizedException('Only clients can pay for Jobs'));
        }

        const { Job, Contract, Profile } = request.app.get('models')
        const job = await Job.findOne({
            where: {
                id: jobId
            },
            include: {
                model: Contract,
                where: {
                    ClientId: profile.id
                },
                include: [{
                    model: Profile,
                    as: 'Client',
                    attributes: ['id', 'balance', 'type']
                },{
                    model: Profile,
                    as: 'Contractor',
                    attributes: ['id', 'balance', 'type']
                }],
            },
        })

        if (!job || job.length == 0) {
            console.log("Error: Job not found for this profile");
            return next(new EntityNotFoundException("Job", jobId));
        }
        if (job.Contract.Client.balance < job.price) {
            return next(new ActionForbiddenException(
                `Insufficient balance. Job price: ${job.price}, Client Balance: ${job.Contract.Client.balance} please recharge first!`));
        }
        if (job.paid == true) {
            return next(new ActionForbiddenException(
                `Job already paid for, cannot perform this action again!`));
        }

        //Transfer money as single managed transaction
        const transferResponse = {
            amountTransfered: 0,
            success: false,
            clientId:job.Contract.Client.id,
            contractorId: job.Contract.Contractor.id
        }
        try {
            await sequelize.transaction(async (t) => {
                const clientOrigBalance = job.Contract.Client.balance;
                const contractorOrigBalance = job.Contract.Contractor.balance;
                //deduct from client
                await Profile.update({
                    balance: clientOrigBalance - job.price
                }, {
                    where: {
                        id: job.Contract.Client.id
                    }
                })

                // deposit into update contractor's balance
                await Profile.update({
                    balance: contractorOrigBalance + job.price
                }, {
                    where: {
                        id: job.Contract.Contractor.id
                    }
                })

                // update job status
                await Job.update({
                    paid: true
                }, {
                    where: {
                        id: job.id
                    }
                })
            });

            transferResponse.amountTransfered = job.price;
            transferResponse.success = true;

            return response.json(transferResponse)
        } catch (error) {
            // Transaction failed already rolled back
            return next(new ServerException(error));
        }
    }

}

export default JobController;