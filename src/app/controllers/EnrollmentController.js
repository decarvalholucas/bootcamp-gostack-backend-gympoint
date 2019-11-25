import { parseISO, addDays, isBefore } from "date-fns";
import * as Yup from "yup";
import Plan from "../models/Plan";
import Student from "../models/Student";
import Enrollment from "../models/Enrollment";

import WelcomeMail from "../jobs/WelcomeMail";
import Queue from "../lib/Queue";

class EnrollmentController {
  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      attributes: ["id", "start_date", "end_date", "price"],
      include: [
        { model: Student, attributes: ["name", "email"], as: "student" },
        { model: Plan, attributes: ["title"], as: "plan" }
      ]
    });
    if (!enrollment || enrollment.length <= 0) {
      return res.json({ error: "There are no enrollments" });
    }
    return res.json(enrollment);
  }

  async store(req, res) {
    // Data valitation
    const schema = Yup.object().shape({
      student_email: Yup.string()
        .email()
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

    const { student_email, plan_id } = req.body;
    const start_date = parseISO(req.body.start_date);

    // Checks if student exists
    const student = await Student.findOne({ where: { email: student_email } });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Checks if plan exists
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Checks if student has an active enrollment
    const studentAlreadyEnrolled = await Enrollment.findOne({
      where: { student_id: student.id }
    });

    if (studentAlreadyEnrolled) {
      return res.status(400).json({ error: "Student already enrolled" });
    }

    // Checks if start_date enrollment date is before today date
    if (isBefore(start_date, new Date())) {
      return res.status(400).json({
        error: "You cannot create an enrollment before today's date."
      });
    }

    // Enrollment end date
    const end_date = addDays(start_date, plan.duration);

    // Enrollment price calculated
    const price = plan.price * (plan.duration / 30);

    // Create enrollment
    const enrollment = await Enrollment.create({
      student_id: student.id,
      plan_id,
      start_date,
      end_date,
      price
    });

    // Send mail to new student
    await Queue.add(WelcomeMail.key, {
      student,
      enrollment,
      start_date,
      end_date,
      plan,
      price
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    // Data valitation
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .min(1)
        .positive()
        .required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    // Check enrollment exists
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not exists" });
    }

    const { plan_id } = req.body;
    const start_date = parseISO(req.body.start_date);

    // Checks if plan exists
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Check if plan already match student plan
    if (plan_id === enrollment.plan_id) {
      return res.status(400).json({ error: "Plan already match student plan" });
    }

    // Checks if start_date enrollment date is before today date
    if (isBefore(start_date, new Date())) {
      return res.status(400).json({
        error: "You cannot create an enrollment before today's date."
      });
    }

    // Enrollment end date
    const end_date = addDays(start_date, plan.duration);

    // Enrollment price calculated
    const price = plan.price * (plan.duration / 30);

    // Create enrollment
    await enrollment.update({ plan_id, start_date, end_date, price });

    return res.json({ plan_id, start_date, end_date, price });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    await enrollment.destroy({ where: { id: req.params.enrollmentId } });
    return res.status(200).json();
  }
}

export default new EnrollmentController();
