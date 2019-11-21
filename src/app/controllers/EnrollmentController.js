import { parseISO, parseJSON, addDays, isBefore, format } from "date-fns";
import ptbr from "date-fns/locale/pt-BR";
import * as Yup from "yup";
import Plan from "../models/Plan";
import Student from "../models/Student";
import Enrollment from "../models/Enrollment";

import Mail from "../lib/Mail";

class EnrollmentController {
  async store(req, res) {
    // Data valitation
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .min(1)
        .positive()
        .required(),
      plan_id: Yup.number()
        .min(1)
        .positive()
        .required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { student_id, plan_id } = req.body;
    const start_date = parseISO(req.body.start_date);

    // Checks if student exists
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    // Checks if plan exists
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: "Plan not found" });
    }

    // Checks if student has an active enrollment
    const studentAlreadyEnrolled = await Enrollment.findAll({
      where: { student_id }
    });

    if (studentAlreadyEnrolled && studentAlreadyEnrolled.length > 0) {
      return res.status(400).json({ error: "Student already enrolled" });
    }

    // Checks if start_date enrollment date is before today date
    if (isBefore(start_date, new Date())) {
      return res.status(401).json({
        error: "You cannot create an enrollment before today's date."
      });
    }

    // Enrollment end date
    const end_date = addDays(start_date, plan.duration);

    // Enrollment price calculated
    const price = plan.price * (plan.duration / 30);

    // Create enrollment
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price
    });

    // Send mail to new student
    await Mail.sendMail({
      to: student.email,
      subject: "Bem vindo ao Gympoint",
      template: "welcome",
      context: {
        student: student.name,
        enrollment: enrollment.id,
        start: format(parseJSON(start_date), "dd 'de' MMMM 'de' yyyy", {
          locale: ptbr
        }),
        end: format(parseJSON(end_date), "dd 'de' MMMM 'de' yyyy", {
          locale: ptbr
        }),
        plan: plan.title,
        price
      }
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
