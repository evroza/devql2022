import { Request } from 'express';
import Profile from '@interfaces/Profile';


interface RequestWithProfile extends Request {
  profile: Profile;
}

export default RequestWithProfile;