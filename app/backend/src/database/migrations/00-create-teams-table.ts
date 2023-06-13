import { Model, QueryInterface, DataTypes } from 'sequelize';
import ITeams from '../../Interfaces/teams/ITeams';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<ITeams>>('teams', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      team_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    })
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('teams');
  }
}