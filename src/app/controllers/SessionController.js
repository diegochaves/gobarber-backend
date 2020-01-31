import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'User/Password does not match.' });
    }

    const { email, password } = request.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return response
        .status(401)
        .json({ error: 'User/Password does not match.' });
    }
    if (!(await user.checkPassword(password))) {
      return response
        .status(401)
        .json({ error: 'User/Password does not match.' });
    }

    const { id, name } = user;
    return response.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
