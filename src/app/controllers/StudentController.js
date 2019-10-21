import Student from "../models/Student";

class StudentController {
  async store(req, res) {
    // Validar os dados no final
    const { email } = req.body;
    const student = await Student.findOne({ where: { email } });
    if (student) {
      return res.status(400).json({ error: "Student already exists" });
    }

    const registredStudent = await Student.create(req.body);

    return res.status(200).json(registredStudent);
  }
}

export default new StudentController();
