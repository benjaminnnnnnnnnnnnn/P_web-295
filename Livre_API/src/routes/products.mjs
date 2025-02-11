import express from "express";
import { Ouvrage } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const OuvragesRouter = express();

/**
* @swagger
* /api/Ouvrages/:
*   get:
*     tags: [Ouvrages]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all Ouvrages.
*     description: Retrieve all Ouvrages. Can be used to populate a select HTML tag.
*     responses:
*       200:
*         description: All Ouvrages.
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
*                     description: The Ouvrage ID.
*                     example: 1
*                   name:
*                     type: string
*                     description: The Ouvrage's name.
*                     example: Big Mac
*                   price:
*                     type: number
*                     description: The Ouvrage's price.
*                     example: 5.99
*
*/
OuvragesRouter.get("/", auth, (req, res) => {
	if (req.query.name) {
		if (req.query.name.length < 2) {
			const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
			return res.status(400).json({ message });
		}
		let limit = 3;
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
		}
		return Ouvrage.findAndCountAll({
			where: { name: { [Op.like]: `%${req.query.name}%` } },
			order: ["name"],
			limit: limit,
		}).then((Ouvrages) => {
			const message = `Il y a ${Ouvrages.count} produits qui correspondent au terme de la recherche`;
			res.json(success(message, Ouvrages));
		});
	}
	Ouvrage.findAll({ order: ["name"] })
		.then((Ouvrages) => {
			const message = "La liste des produits a bien été récupérée.";
			res.json(success(message, Ouvrages));
		})
		.catch((error) => {
			const message =
				"La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

OuvragesRouter.get("/:id", auth, (req, res) => {
	Ouvrage.findByPk(req.params.id)
		.then((Ouvrage) => {
			if (Ouvrage === null) {
				const message =
					"Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			const message = `Le produit dont l'id vaut ${Ouvrage.id} a bien été récupéré.`;
			res.json(success(message, Ouvrage));
		})
		.catch((error) => {
			const message =
				"Le produit n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

OuvragesRouter.post("/", auth, (req, res) => {
	Ouvrage.create(req.body)
		.then((createdOuvrage) => {
			// Définir un message pour le consommateur de l'API REST
			const message = `Le produit ${createdOuvrage.name} a bien été créé !`;
			// Retourner la réponse HTTP en json avec le msg et le produit créé
			res.json(success(message, createdOuvrage));
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

OuvragesRouter.delete("/:id", auth, (req, res) => {
	Ouvrage.findByPk(req.params.id)
		.then((deletedOuvrage) => {
			if (deletedOuvrage === null) {
				const message =
					"Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			return Ouvrage.destroy({
				where: { id: deletedOuvrage.id },
			}).then((_) => {
				// Définir un message pour le consommateur de l'API REST
				const message = `Le produit ${deletedOuvrage.name} a bien été supprimé !`;
				// Retourner la réponse HTTP en json avec le msg et le produit créé
				res.json(success(message, deletedOuvrage));
			});
		})
		.catch((error) => {
			const message =
				"Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

OuvragesRouter.put("/:id", auth, (req, res) => {
	const OuvrageId = req.params.id;
	Ouvrage.update(req.body, { where: { id: OuvrageId } })
		.then((_) => {
			return Ouvrage.findByPk(OuvrageId).then((updatedOuvrage) => {
				if (updatedOuvrage === null) {
					const message =
						"Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
					// A noter ici le return pour interrompre l'exécution du code
					return res.status(404).json({ message });
				}
				// Définir un message pour l'utilisateur de l'API REST
				const message = `Le produit ${updatedOuvrage.name} dont l'id vaut ${updatedOuvrage.id} a été mis à jour avec succès !`;
				// Retourner la réponse HTTP en json avec le msg et le produit créé
				res.json(success(message, updatedOuvrage));
			});
		})
		.catch((error) => {
			const message =
				"Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

export { OuvragesRouter };
