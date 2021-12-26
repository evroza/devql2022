import { DataTypes, Model } from "sequelize";
import { sequelize } from "@models/model";
import { Options, Attribute } from 'sequelize-decorators'


@Options({
    sequelize: sequelize,
    modelName: 'Contract'
})
export default class Contract extends Model {
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
    public terms: string;

    @Attribute({
        type: DataTypes.ENUM('new', 'in_progress', 'terminated'),
        allowNull: false
    })
    public status: string;

    // Relationships
    static associate(models) {
        this.belongsTo(models.Profile, { as: 'Contractor' });
        this.belongsTo(models.Profile, { as: 'Client' });
        this.hasMany(models.Job, {
            as: 'Contracts', foreignKey: 'ContractId'
        });
    }
}
