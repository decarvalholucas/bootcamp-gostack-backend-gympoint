import Sequelize, { Model } from "sequelize";

class Enrollment extends Model {
  static init(connection) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.INTEGER
      },
      {
        sequelize: connection
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: "student_id", as: "student" });
    this.belongsTo(models.Plan, { foreignKey: "plan_id", as: "plan" });
  }
}

export default Enrollment;
