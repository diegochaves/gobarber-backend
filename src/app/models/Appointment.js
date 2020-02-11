import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        defaultScope: {
          attributes: ['id', 'date', 'canceled_at'],
          include: ['user', 'provider'],
        },
        sequelize,
        modelName: 'Appointment',
      }
    );
    return this;
  }

  static associate({ User }) {
    this.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
