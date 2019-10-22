import Sequelize, { Model } from "sequelize";

class Student extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        birthDate: Sequelize.VIRTUAL,
        birth_date: Sequelize.DATEONLY,
        weight: Sequelize.DECIMAL,
        height: Sequelize.DECIMAL
      },
      {
        sequelize: connection
      }
    );

    this.addHook("beforeSave", student => {
      if (student.birthDate) {
        const [day, month, year] = student.birthDate.split("/");
        student.birth_date = `${year}-${month}-${day}`;
      }
    });

    return this;
  }
}

export default Student;
