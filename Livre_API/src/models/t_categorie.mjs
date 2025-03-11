const CategorieModel = (sequelize, DataTypes) => {
    return sequelize.define(
      "Categorie",
      {
        idCategorie: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        nomCategorie: {
          type: DataTypes.STRING(50),
          allowNull: true,
          validate: {
            notEmpty: {
              msg: "Le nom de la catégorie ne peut pas être vide.",
            },
          },
        },
      },
      {
        tableName: "t_categorie",
        timestamps: false,
      }
    );
  };
  
  export { CategorieModel };
  
  