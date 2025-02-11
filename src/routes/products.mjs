import express from "express";
import { Product } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const productsRouter = express();

/**
* @swagger
* /api/products/:
*   get:
*     tags: [Products]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all products.
*     description: Retrieve all products. Can be used to populate a select HTML tag.
*     responses:
*       200:
*         description: All products.
*         content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                     description: The product ID.
*                     example: 1
*                   name:
*                     type: string
*                     description: The product's name.
*                     example: Big Mac
*                   price:
*                     type: number
*                     description: The product's price.
*                     example: 5.99
*
*/
productsRouter.get("/", auth, (req, res) => {
	if (req.query.name) {
		if (req.query.name.length < 2) {
			const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
			return res.status(400).json({ message });
		}
		let limit = 3;
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
		}
		return Product.findAndCountAll({
			where: { name: { [Op.like]: `%${req.query.name}%` } },
			order: ["name"],
			limit: limit,
		}).then((products) => {
			const message = `Il y a ${products.count} produits qui correspondent au terme de la recherche`;
			res.json(success(message, products));
		});
	}
	Product.findAll({ order: ["name"] })
		.then((products) => {
			const message = "La liste des produits a bien été récupérée.";
			res.json(success(message, products));
		})
		.catch((error) => {
			const message =
				"La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

productsRouter.get("/:id", auth, (req, res) => {
	Product.findByPk(req.params.id)
		.then((product) => {
			if (product === null) {
				const message =
					"Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			const message = `Le produit dont l'id vaut ${product.id} a bien été récupéré.`;
			res.json(success(message, product));
		})
		.catch((error) => {
			const message =
				"Le produit n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

productsRouter.post("/", auth, (req, res) => {
	Product.create(req.body)
		.then((createdProduct) => {
			// Définir un message pour le consommateur de l'API REST
			const message = `Le produit ${createdProduct.name} a bien été créé !`;
			// Retourner la réponse HTTP en json avec le msg et le produit créé
			res.json(success(message, createdProduct));
		})
		.catch((error) => {
			if (error instanceof ValidationError) {
				return res.status(400).json({ message: error.message, data: error });
			}
			const message =
				"Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

productsRouter.delete("/:id", auth, (req, res) => {
	Product.findByPk(req.params.id)
		.then((deletedProduct) => {
			if (deletedProduct === null) {
				const message =
					"Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			return Product.destroy({
				where: { id: deletedProduct.id },
			}).then((_) => {
				// Définir un message pour le consommateur de l'API REST
				const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
				// Retourner la réponse HTTP en json avec le msg et le produit créé
				res.json(success(message, deletedProduct));
			});
		})
		.catch((error) => {
			const message =
				"Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

productsRouter.put("/:id", auth, (req, res) => {
	const productId = req.params.id;
	Product.update(req.body, { where: { id: productId } })
		.then((_) => {
			return Product.findByPk(productId).then((updatedProduct) => {
				if (updatedProduct === null) {
					const message =
						"Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
					// A noter ici le return pour interrompre l'exécution du code
					return res.status(404).json({ message });
				}
				// Définir un message pour l'utilisateur de l'API REST
				const message = `Le produit ${updatedProduct.name} dont l'id vaut ${updatedProduct.id} a été mis à jour avec succès !`;
				// Retourner la réponse HTTP en json avec le msg et le produit créé
				res.json(success(message, updatedProduct));
			});
		})
		.catch((error) => {
			const message =
				"Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

export { productsRouter };
