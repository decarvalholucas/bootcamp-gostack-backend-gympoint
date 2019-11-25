import * as Yup from "yup";
import Student from "../models/Student";
import Help from "../models/HelpOrder";

class HelpController {
  async store(req, res) {
    const dataValidate = Yup.object().shape({
      studentId: Yup.number()
        .min(1)
        .required(),
      question: Yup.string()
        .required()
        .min(1)
    });

    if (!(await dataValidate.isValid({ ...req.params, ...req.body }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const student = await Student.findByPk(req.params.studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const help = await Help.create({
      student_id: req.params.studentId,
      question: req.body.question
    });

    return res.json(help);
  }

  async update(req, res) {
    const dataValidate = Yup.object().shape({
      questionId: Yup.number()
        .min(1)
        .required(),
      answer: Yup.string()
        .required()
        .min(1)
    });

    if (!(await dataValidate.isValid({ ...req.params, ...req.body }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const help = await Help.findOne({ where: { id: req.params.questionId } });
    if (!help) {
      return res.status(404).json({ error: "Question not found" });
    }

    await help.update({
      answer: req.body.answer,
      answer_at: new Date()
    });

    return res.json(help);
  }
}

export default new HelpController();
