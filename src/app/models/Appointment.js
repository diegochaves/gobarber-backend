import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        defaultScope: {
          attributes: ['id', 'date', 'canceled_at', 'past', 'cancelable'],
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
