import Mail from "../lib/Mail";

class AnswerMail {
  get key() {
    return "AnswerMail";
  }

  async handle({ data }) {
    const { question, answer, student } = data;

    await Mail.sendMail({
      to: student.email,
      subject: "Você tem uma nova resposta",
      template: "answer",
      context: {
        student: student.name,
        question,
        answer
      }
    });
  }
}

export default new AnswerMail();
