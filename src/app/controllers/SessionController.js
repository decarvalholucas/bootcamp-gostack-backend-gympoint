// Import Node Modules
import jwt from "jsonwebtoken";
import * as Yup from "yup";

// Import Application Modules
import User from "../models/User";
import authConfig from "../../config/auth";

class SessionController {
  async store(req, res) {
    // Data validate
    const dataValidate = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await dataValidate.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fail" });
    }

    // Checks if user exists and password matches
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password does not match" });
    }

    // Returns new session with user and JWT token
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expireIn
      })
    });
  }
}

export default new SessionController();
