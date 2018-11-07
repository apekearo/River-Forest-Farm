module.exports = function(sequelize, DataTypes) {
    var Crop = sequelize.define("Crop", {
      cropName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      cropTotal: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1]
      }
    });
  
    Crop.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Crop.belongsTo(models.Author, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Crop;
  };