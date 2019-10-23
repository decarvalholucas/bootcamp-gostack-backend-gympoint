import * as Yup from "yup";

import Student from "../models/Student";
import dateFormat from "../../config/dateFormat";

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ["name", "email", "birth_date", "weight", "height"]
    });
    if (!students) {
      return res.status(400).json({ error: "No registered student" });
    }
    return res.status(200).json(students);
  }

  async store(req, res) {
    const dataValidate = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      birthDate: Yup.string()
        .matches(dateFormat.dd_mm_yyyy, { excludeEmptyString: true })
        .required(),
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

    const { id, name, birthDate, weight, height } = await Student.create(
      req.body
    );
    const [yaear, month, day] = birthDate.split("-");

    return res.status(200).json({
      id,
      name,
      email,
      birthDate: `${day}/${month}/${yaear}`,
      weight,
      height
    });
  }

  async update(req, res) {
    const dataValidate = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .min(1),
      birthDate: Yup.string().matches(dateFormat.dd_mm_yyyy, {
        excludeEmptyString: true
      }),
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

    const { id, name, email, birthDate, weight, height } = await student.update(
      req.body
    );

    return res.status(200).json({
      id,
      name,
      email,
      birthDate,
      weight,
      height
    });
  }
}

export default new StudentController();
