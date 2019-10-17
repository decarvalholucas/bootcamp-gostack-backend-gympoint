import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        is_admin: Sequelize.BOOLEAN
      },
      {
        sequelize: connection
      }
    );
    return this;
  }
}

export default User;
