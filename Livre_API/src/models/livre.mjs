const OuvrageModel = (sequelize, DataTypes) => {
	return sequelize.define(
	  "Ouvrage",
	  {
		idOuvrage: {
		  type: DataTypes.INTEGER,
		  primaryKey: true,
		  autoIncrement: true,
		  allowNull: false,
		},
		titre: {
		  type: DataTypes.STRING(100),
		  allowNull: false,
		  validate: {
			notEmpty: {
			  msg: "Le titre ne peut pas être vide.",
			},
		  },
		},
		nbPages: {
		  type: DataTypes.INTEGER,
		  allowNull: false,
		  validate: {
			isInt: {
			  msg: "Le nombre de pages doit être un nombre entier.",
			},
		  },
		},
		extrait: {
		  type: DataTypes.STRING(1000),
		  allowNull: true,
		},
		resume: {
		  type: DataTypes.STRING(2000),
		  allowNull: true,
		},
		anneeEdition: {
		  type: DataTypes.INTEGER,
		  allowNull: true,
		  validate: {
			isInt: {
			  msg: "L'année d'édition doit être un nombre entier.",
			},
		  },
		},
		moyenneAppreciation: {
		  type: DataTypes.DECIMAL(15, 2),
		  allowNull: true,
		  validate: {
			isDecimal: {
			  msg: "La moyenne d'appréciation doit être un nombre décimal.",
			},
		  },
		},
		imageCouverture: {
		  type: DataTypes.STRING(255),
		  allowNull: true,
		},
		idCategorie: {
		  type: DataTypes.INTEGER,
		  allowNull: false,
		  validate: {
			notNull: {
			  msg: "La catégorie est requise.",
			},
		  },
		},
		idAuteur: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
			  notNull: {
				msg: "L'auteur est requise.",
			  },
			},
		  },
	  },
	  {
		tableName: "t_ouvrage",
		timestamps: false,
	  }
	);
  };
  
  export { OuvrageModel };
  