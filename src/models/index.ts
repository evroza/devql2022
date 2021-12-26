import { sequelize } from "./model";
import Contract from '@models/Contract';
import Profile from '@models/Profile';
import Job from '@models/Job';


const models = {
    Profile,
    Contract,
    Job
};
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export {
    sequelize,
    Profile,
    Contract,
    Job
}