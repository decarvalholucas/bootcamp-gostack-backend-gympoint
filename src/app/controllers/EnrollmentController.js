import { parseISO, addDays, subDays, isBefore } from "date-fns";
import * as Yup from "yup";
import Plan from "../models/Plan";
import Student from "../models/Student";
import Enrollment from "../models/Enrollment";

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

    const [day, month, yaer] = req.body.start_date.split("/");
    const start_date = parseISO(`${yaer}-${month}-${day}`);
    const { student_id, plan_id } = req.body;

    if (
      !(await schema.isValid({
        start_date,
        student_id,
        plan_id
      }))
    ) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    // Checks if student exists
    const student = await Student.findByPk(req.body.student_id);

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    // Checks if plan exists
    const plan = await Plan.findByPk(req.body.plan_id);
    if (!plan) {
      return res.status(400).json({ error: "Plan not found" });
    }

    // Checks if student has an active enrollment
    const studentAlreadyEnrolled = await Enrollment.findAll({
      where: { student_id: student.id }
    });

    if (studentAlreadyEnrolled && studentAlreadyEnrolled.length > 0) {
      return res.status(400).json({ error: "Student already enrolled" });
    }

    // Checks if start_date enrollment date is before today date
    const dateWithSub = subDays(start_date, 1);

    if (isBefore(dateWithSub, new Date())) {
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

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
