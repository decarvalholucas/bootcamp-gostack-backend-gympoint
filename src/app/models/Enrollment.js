import Sequelize, { Model } from "sequelize";

class Enrollment extends Model {
  static init(connection) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
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
}

export default Enrollment;
