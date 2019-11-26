import * as Yup from "yup";
import Student from "../models/Student";
import Help from "../models/HelpOrder";
import Queue from "../lib/Queue";
import AnswerMail from "../jobs/AnswerMail";

class HelpController {
  async index(req, res) {
    const helps = await Help.findAll({
      where: { answer: null },
      attributes: ["id", "question", "answer", "answer_at"],
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "email"]
        }
      ]
    });
    return res.json(helps);
  }

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

    if (help.answer !== null) {
      return res
        .status(400)
        .json({ error: "This question has already been answered." });
    }

    await help.update({
      answer: req.body.answer,
      answer_at: new Date()
    });

    const student = await Student.findByPk(help.student_id);

    await Queue.add(AnswerMail.key, {
      student,
      question: help.question,
      answer: help.answer
    });

    return res.json(help);
  }
}

export default new HelpController();
