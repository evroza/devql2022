import { DataTypes, Model } from "sequelize";
import {Options, Attribute} from 'sequelize-decorators'
import { sequelize } from "@models/model";


@Options({ 
    sequelize: sequelize, 
    modelName: 'Job' 
})
export default class Job extends Model {
    // Table Fields
    @Attribute({
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    public id: number;
    
    @Attribute({
        type: DataTypes.TEXT,
        allowNull: false
    })
    public description: string;

    @Attribute({
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    })
    public price: number;

    @Attribute({
        type: DataTypes.BOOLEAN,
        defaultValue: false
    })
    public paid: boolean;

    @Attribute()
    public paymentDate: Date;

    // Relationships
    static associate (models) {
        this.belongsTo(
            models.Contract
        );
    }
}

