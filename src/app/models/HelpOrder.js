import Sequelize, { Model } from "sequelize";

class HelpOrder extends Model {
  static init(connection) {
    super.init(
      {
        question: Sequelize.TEXT,
        answer: Sequelize.TEXT,
        answer_at: Sequelize.DATE
      },
      {
        sequelize: connection
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: "student_id", as: "student" });
  }
}

export default HelpOrder;
