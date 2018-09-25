module.exports = function(sequelize, DataTypes) {
    var clist = sequelize.define("clist", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1]
      }
    });
  
    clist.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      clist.belongsTo(models.Author, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return clist;
  };