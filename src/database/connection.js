import Sequelize from "sequelize";
import mongoose from "mongoose";

import User from "../app/models/User";
import Student from "../app/models/Student";
import Plan from "../app/models/Plan";
import Enrollment from "../app/models/Enrollment";
import Help from "../app/models/HelpOrder";

import databaseConfig from "../app/config/database";

const models = [User, Student, Plan, Enrollment, Help];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://localhost:27017/mongopoint",
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      }
    );
  }
}

export default new Database();
