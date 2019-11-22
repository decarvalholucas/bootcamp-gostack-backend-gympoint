import { format, parseJSON } from "date-fns";
import ptbr from "date-fns/locale/pt-BR";
import Mail from "../lib/Mail";

class WelcomeMail {
  get key() {
    return "WelcomeMail";
  }

  async handle({ data }) {
    const { student, enrollment, start_date, end_date, plan, price } = data;

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
  }
}

export default new WelcomeMail();
