const ApprecierModel = (sequelize, DataTypes) => {
    return sequelize.define(
      "Apprecier",
      {
        idUtilisateur: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          validate: {
            notNull: {
              msg: "L'utilisateur est requis.",
            },
          },
        },
        appreciation: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            isInt: {
              msg: "L'appréciation doit être un nombre entier.",
            },
          },
        },
        idOuvrage: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
              msg: "L'ouvrage est requis.",
            },
          },
        },
      },
      {
        tableName: "t_apprecier",
        timestamps: false,
      }
    );
  };
  
  export { ApprecierModel };
  