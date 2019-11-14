import * as Yup from "yup";

import Plan from "../models/Plan";

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ["id", "title", "duration", "price"]
    });
    if (!plans) {
      return res.status(400).json({ error: "No registered plans" });
    }
    return res.json(plans);
  }

  async store(req, res) {
    const dataValidate = Yup.object().shape({
      title: Yup.string()
        .min(2)
        .required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required()
    });

    if (!(await dataValidate.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const plan = await Plan.findOne({
      where: { title: req.body.title }
    });

    if (plan) {
      return res
        .status(400)
        .json({ error: "A plan with this name already exists" });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async update(req, res) {
    const dataValidate = Yup.object().shape({
      title: Yup.string().min(2),
      duration: Yup.number().positive(),
      price: Yup.number().positive()
    });

    if (!(await dataValidate.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
    }

    console.log(plan.title);

    if (req.body.title && req.body.title !== plan.title) {
      const planExists = await Plan.findOne({
        where: { title: req.body.title }
      });
      if (planExists) {
        return res
          .status(400)
          .json({ error: "A plan with this name already exists" });
      }
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    await plan.destroy({ where: { id: req.params.id } }, { truncate: false });
    return res.status(200).json();
  }
}

export default new PlanController();
