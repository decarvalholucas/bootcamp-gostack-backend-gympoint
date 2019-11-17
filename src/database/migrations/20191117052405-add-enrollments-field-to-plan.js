module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("plans", "enrollment_id", {
      type: Sequelize.INTEGER,
      references: { model: "enrollments", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn("plans", "enrollment_id");
  }
};
