import { Request, Response } from "express";
import Profile from "@interfaces/Profile";

/**
 * Middleware that intercepts request header 'profile_id' and adds
 * corresponding profile to the request object if exists
 */
export const getProfile = async (req: Request, res: Response, next) => {
    const {Profile} = req.app.get('models')
    const profile: Profile = await Profile.findOne({where: {id: req.headers['profile_id'] || 0}})
    if(!profile) return res.status(401).end()
    req['profile'] = profile
    next()
}
