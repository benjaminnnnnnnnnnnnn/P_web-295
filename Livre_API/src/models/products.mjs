// https://sequelize.org/docs/v7/models/data-types/
const ProductModel = (sequelize, DataTypes) => {
	return sequelize.define(
		"Product",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					msg: "Ce nom est déjà pris.",
				},
				validate: {
					is: {
						args: /^[A-Za-z\s]*$/,
						msg: "Seules les lettres et les espaces sont autorisées.",
					},
					notEmpty: {
						msg: "Le nom ne peut pas être vide.",
					},
					notNull: {
						msg: "Le nom est une propriété obligatoire.",
					},
				},
			},
			price: {
				type: DataTypes.FLOAT,
				allowNull: false,
				validate: {
					isFloat: {
						msg: "Utilisez uniquement des nombres pour le prix.",
					},
					notEmpty: {
						msg: "Le prix ne peut pas être vide.",
					},
					notNull: {
						msg: "Le prix est une propriété obligatoire.",
					},
					min: {
						args: [1.0],
						msg: "Le prix doit être supérieur à 1$.",
					},
					max: {
						args: [1000.0],
						msg: "Le prix doit être inférieur à 1000$.",
					},
				},
			},
		},
		{
			timestamps: true,
			createdAt: "created",
			updatedAt: false,
		}
	);
};
export { ProductModel };
