import Student from "../models/Student";
import User from "../models/User";

class StudentController {
  async store(req, res) {
    // Verify if exists students
    const { email } = req.body;
    const student = await Student.findOne({ where: { email } });
    if (student) {
      return res.status(400).json({ error: "Student already exists" });
    }

    // Verify if user is administrator
    const user = await User.findByPk(req.userId);
    console.log(user);
    if (!user || !user.is_admin) {
      return res.status(401).json({ error: "You are not administrator" });
    }

    const registredStudent = await Student.create(req.body);

    return res.status(200).json(registredStudent);
  }
}

export default new StudentController();
