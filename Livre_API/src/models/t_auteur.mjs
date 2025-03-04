const AuteurModel = (sequelize, DataTypes) => {
    return sequelize.define(
      "Auteur",
      {
        idAuteur: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        nomAuteur: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        prenomAuteur: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
      },
      {
        tableName: "t_auteur",
        timestamps: false,
      }
    );
  };
  
  export { AuteurModel };