const EditeurModel = (sequelize, DataTypes) => {
    return sequelize.define(
      "Auteur",
      {
        idEditeur: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        nomEditeur: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        prenomEditeur: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
      },
      {
        tableName: "t_editeur",
        timestamps: false,
      }
    );
  };
  
  export { EditeurModel };