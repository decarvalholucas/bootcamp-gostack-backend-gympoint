import * as Yup from "yup";

import { parseISO } from "date-fns";
import Student from "../models/Student";

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ["id", "name", "email", "birth_date", "weight", "height"]
    });
    if (!students) {
      return res.status(400).json({ error: "No registered student" });
    }
    return res.json(students);
  }

  async store(req, res) {
    const dataValidate = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      birth_date: Yup.date().required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required()
    });

    if (!(await dataValidate.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { email } = req.body;

    const student = await Student.findOne({ where: { email } });
    if (student) {
      return res.status(400).json({ error: "Student already exists" });
    }

    req.body.birth_date = parseISO(req.body.birth_date);

    const { id, name, birth_date, weight, height } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, birth_date, weight, height });
  }

  async update(req, res) {
    const dataValidate = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .min(1),
      birth_date: Yup.date(),
      weight: Yup.number().positive(),
      height: Yup.number().positive()
    });

    if (!(await dataValidate.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      res.status(404).json({ error: "Student not found" });
    }

    if (req.body.email && req.body.email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email: req.body.email }
      });
      if (studentExists) {
        return res.status(400).json({ error: "E-mail is already in use" });
      }
    }

    if (req.body.birth_date)
      req.body.birth_date = parseISO(req.body.birth_date);

    const {
      id,
      name,
      email,
      birth_date,
      weight,
      height
    } = await student.update(req.body);

    return res.json({ id, name, email, birth_date, weight, height });
  }
}

export default new StudentController();
