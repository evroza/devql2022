import { DataTypes, Model } from "sequelize";
import {Options, Attribute} from 'sequelize-decorators'
import { sequelize } from "@models/model";


@Options({ 
    sequelize,
    modelName: 'Profile'
})
export default class Profile extends Model {
    // Table Fields
    @Attribute({
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    })
    public id: number;

    @Attribute({
        type: DataTypes.STRING,
        allowNull: false
    })
    public firstName: string;

    @Attribute({
        type: DataTypes.STRING,
        allowNull: false
    })
    public lastName: string;

    @Attribute({
        type: DataTypes.STRING,
        allowNull: false
    })
    public profession: string;

    @Attribute({
        type: DataTypes.DECIMAL(12,2)
    })
    public balance: number;

    @Attribute({
        type: DataTypes.ENUM('client', 'contractor')
    })
    public type: string;

    @Attribute({
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: DataTypes.NOW
    })
    public createdAt: Date;

    @Attribute({
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: DataTypes.NOW
    })
    public updatedAt: Date;

    

    // Relationships
    static associate (models) {
        this.hasMany(models.Contract, {as :'Contractor',foreignKey:'ContractorId'});
        this.hasMany(models.Contract, {as : 'Client', foreignKey:'ClientId'});
    }
}
