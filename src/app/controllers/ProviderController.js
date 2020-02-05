import User from '../models/User';

class ProviderController {
  async index(request, response) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email'],
      include: ['avatar'],
    });
    return response.json({ providers });
  }
}

export default new ProviderController();
