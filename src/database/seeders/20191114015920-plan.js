module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      "plans",
      [
        {
          title: "Start",
          duration: 30,
          price: 129,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: "Gold",
          duration: 90,
          price: 109,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: "Diamond",
          duration: 180,
          price: 89,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete("plans", null, {});
  }
};
