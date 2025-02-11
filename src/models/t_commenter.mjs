const CommenterModel = (sequelize, DataTypes) => {
    return sequelize.define(
      "Commenter",
      {
        idOuvrage: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          validate: {
            notNull: {
              msg: "L'ouvrage est requis.",
            },
          },
        },
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
        commentaire: {
          type: DataTypes.STRING(150),
          allowNull: true,
          validate: {
            len: {
              args: [0, 150],
              msg: "Le commentaire ne peut pas dépasser 150 caractères.",
            },
          },
        },
      },
      {
        tableName: "t_commenter",
        timestamps: false,
      }
    );
  };
  
  export { CommenterModel };
  