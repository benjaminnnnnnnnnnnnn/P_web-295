import { Sequelize, DataTypes } from "sequelize";
import { ProductModel } from "../models/products.mjs";
import { UserModel } from "../models/UserModel.mjs";
import * as bcrypt from "bcrypt";
const sequelize = new Sequelize(
	"db_products", // Nom de la DB qui doit exister
	"root", // Nom de l'utilisateur
	"root", // Mot de passe de l'utilisateur
	{
		host: "localhost",
		port: "6033",
		dialect: "mysql",
		logging: false,
	}
);
import { products } from "./mock-livre.mjs";
// Le modèle product
const User = UserModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
let initDb = () => {
	return sequelize
		.sync({ force: true }) // Force la synchro => donc supprime les données également
		.then((_) => {
			importProducts();
			importUsers();
			console.log("La base de données db_products a bien été synchronisée");
		});
};
const importProducts = () => {
	// import tous les produits présents dans le fichier db/mock-product
	products.map((product) => {
		Product.create({
			name: product.name,
			price: product.price,
		}).then((product) => console.log(product.toJSON()));
	});
};
const importUsers = () => {
	bcrypt
		.hash("etml", 10) // temps pour hasher = du sel
		.then((hash) =>
			User.create({
				username: "etml",
				password: hash,
			})
		)
		.then((user) => console.log(user.toJSON()));
};
export { sequelize, initDb, Product, User };
