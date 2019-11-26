import { isAfter, startOfDay, endOfDay, subDays } from "date-fns";
import * as Yup from "yup";
import Checkin from "../schemas/Checkin";
import Student from "../models/Student";
import Enrollment from "../models/Enrollment";

class CheckinController {
  async index(req, res) {
    const paramValidate = Yup.object().shape({
      studentId: Yup.number()
        .min(1)
        .required()
    });

    if (!(await paramValidate.isValid(req.params))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    // Check if student exists
    const student = await Student.findByPk(req.params.studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const checkin = await Checkin.find({ student_id: req.params.studentId })
      .sort({ createdAt: "desc" })
      .limit(5);

    return res.json(checkin);
  }

  async store(req, res) {
    const paramValidate = Yup.object().shape({
      studentId: Yup.number()
        .min(1)
        .required()
    });

    if (!(await paramValidate.isValid(req.params))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { studentId: student_id } = req.params;

    // Check if student exists
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student has active enrollment
    const enrollment = await Enrollment.findOne({ where: { student_id } });
    const today = startOfDay(new Date());
    if (isAfter(today, enrollment.end_date)) {
      return res.json({ error: "You do not have an active enrollment" });
    }

    // Checks if the student has already checked in 5 times
    const busyDays = subDays(today, 7);

    const checkin = await Checkin.find({ student_id })
      .gte("createdAt", startOfDay(busyDays))
      .lte("createdAt", endOfDay(today))
      .countDocuments();

    if (checkin >= 5) {
      return res.status(400).json({
        error: "Limit exceeded, You can only do 5 check-ins every 7 days."
      });
    }

    const { _id, createdAt, updatedAt } = await Checkin.create({ student_id });

    return res.json({
      _id,
      createdAt,
      updatedAt
    });
  }
}

export default new CheckinController();
