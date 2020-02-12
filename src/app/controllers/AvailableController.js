import {
  startOfDay,
  endOfDay,
  setSeconds,
  setHours,
  setMinutes,
  isAfter,
  format,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(request, response) {
    const { date } = request.query;

    if (!date) {
      return response.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: request.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [];
    for (let i = 8; i < 20; i += 1) {
      schedule.push(`${i.toString().padStart(2, '0')}:00`);
    }

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(
            appointment => format(appointment.date, 'HH:mm') === time
          ),
      };
    });

    return response.json(available);
  }
}

export default new AvailableController();
