import User from '../models/User';

class ProviderController {
  async index(request, response) {
    const providers = await User.findAll({
      where: { provider: true },
    });
    return response.json({ providers });
  }
}

export default new ProviderController();
