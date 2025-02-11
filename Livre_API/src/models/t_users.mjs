const UtilisateurModel = (sequelize, DataTypes) => {
	return sequelize.define(
	  "Utilisateur",
	  {
		idUtilisateur: {
		  type: DataTypes.INTEGER,
		  primaryKey: true,
		  autoIncrement: true,
		  allowNull: false,
		},
		nomUtilisateur: {
		  type: DataTypes.STRING(50),
		  allowNull: true,
		  validate: {
			notEmpty: {
			  msg: "Le nom d'utilisateur ne peut pas être vide.",
			},
		  },
		},
		mdp: {
		  type: DataTypes.STRING(255),
		  allowNull: true,
		  validate: {
			notEmpty: {
			  msg: "Le mot de passe ne peut pas être vide.",
			},
		  },
		},
		createdAt: {
		  type: DataTypes.DATE,
		  allowNull: true,
		},
		nbPropositions: {
		  type: DataTypes.STRING(50),
		  allowNull: true,
		},
	  },
	  {
		tableName: "t_utilisateur",
		timestamps: false,
	  }
	);
  };
  
  export { UtilisateurModel };
  