module.exports = function(sequelize, DataTypes) {
  const Habit = sequelize.define("Habit", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      default: false,
      allowNull: false
    },
    //not necessary (I think):
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Habit.associate = function(models) {
    Habit.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Habit;
};
