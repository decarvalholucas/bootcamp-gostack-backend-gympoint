import Sequelize, { Model } from "sequelize";

class Student extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        weight: Sequelize.DECIMAL,
        height: Sequelize.DECIMAL
      },
      {
        sequelize: connection
      }
    );

    return this;
  }
}

export default Student;
