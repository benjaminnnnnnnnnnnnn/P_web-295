import express from "express";
import { Ouvrage } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const OuvragesRouter = express();

/**
* @swagger
* /api/Livres/:
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
*                   idOuvrage:
*                     type: integer
*                     description: The Ouvrage ID.
*                     example: 1
*                   titre:
*                     type: string
*                     description: The Ouvrage's name.
*                     example: Livre 1
*                   nbPages:
*                     type: number
*                     description: The Ouvrage's price.
*                     example: 5
*                   extrait:
*                     type: string
*                     description: The Ouvrage's description.
*                     example: extrait
*                   resume:
*                     type: string
*                     description: The Ouvrage's description.
*                     example: resume
*                   nomAuteur:
*                     type: string
*                     description: The Ouvrage's description.
*                     example: nomAuteur
*                   prenomAuteur:
*                     type: string
*                     description: The Ouvrage's description.
*                     example: prenomAuteur
*                   nomEditeur:
*                     type: string
*                     description: The Ouvrage's description.
*                     example: nomEditeur
*                   anneeEdition:
*                     type: number
*                     description: The Ouvrage's description.
*                     example: 2021
*                   moyenneAppreciation:
*                     type: number
*                     description: The Ouvrage's description.
*                     example: 5
*                   imageCouverture:
*                     type: string
*                     description: The Ouvrage's description.
*                     example: imageCouverture
*                   idCategorie:
*                     type: number
*                     description: The Ouvrage's description.
*                     example: 1
*
*/
OuvragesRouter.get("/", auth, (req, res) => {
	if (req.query.titre) {
		if (req.query.titre.length < 2) {
			const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
			return res.status(400).json({ message });
		}
		let limit = 3;
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
		}
		return Ouvrage.findAndCountAll({
			where: { titre: { [Op.like]: `%${req.query.titre}%` } },
			order: ["titre"],
			limit: limit,
		}).then((Ouvrages) => {
			const message = `Il y a ${Ouvrages.count} livre qui correspondent au terme de la recherche`;
			res.json(success(message, Ouvrages));
		});
	}
	Ouvrage.findAll({ order: ["titre"] })
		.then((Ouvrages) => {
			const message = "La liste des livres a bien été récupérée.";
			res.json(success(message, Ouvrages));
		})
		.catch((error) => {
			const message =
				"La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

OuvragesRouter.get("/:id", auth, (req, res) => {
	Ouvrage.findByPk(req.params.id)
		.then((Ouvrage) => {
			if (Ouvrage === null) {
				const message =
					"Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			const message = `Le livre dont l'id vaut ${Ouvrage.id} a bien été récupéré.`;
			res.json(success(message, Ouvrage));
		})
		.catch((error) => {
			const message =
				"Le livre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

OuvragesRouter.post("/", auth, (req, res) => {
	Ouvrage.create(req.body)
		.then((createdOuvrage) => {
			// Définir un message pour le consommateur de l'API REST
			const message = `Le livre ${createdOuvrage.name} a bien été créé !`;
			// Retourner la réponse HTTP en json avec le msg et le livre créé
			res.json(success(message, createdOuvrage));
		})
		.catch((error) => {
			if (error instanceof ValidationError) {
				return res.status(400).json({ message: error.message, data: error });
			}
			const message =
				"Le livre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

OuvragesRouter.delete("/:id", auth, (req, res) => {
	Ouvrage.findByPk(req.params.id)
		.then((deletedOuvrage) => {
			if (deletedOuvrage === null) {
				const message =
					"Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			return Ouvrage.destroy({
				where: { idOuvrage: deletedOuvrage.idOuvrage },
			}).then((_) => {
				// Définir un message pour le consommateur de l'API REST
				const message = `Le livre ${deletedOuvrage.titre} a bien été supprimé !`;
				// Retourner la réponse HTTP en json avec le msg et le livre créé
				res.json(success(message, deletedOuvrage));
			});
		})
		.catch((error) => {
			const message =
				"Le livre n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

OuvragesRouter.put("/:id", auth, (req, res) => {
	const OuvrageId = req.params.id;
	Ouvrage.update(req.body, { where: { idOuvrage: OuvrageId } })
		.then((_) => {
			return Ouvrage.findByPk(OuvrageId).then((updatedOuvrage) => {
				if (updatedOuvrage === null) {
					const message =
						"Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
					// A noter ici le return pour interrompre l'exécution du code
					return res.status(404).json({ message });
				}
				// Définir un message pour l'utilisateur de l'API REST
				const message = `Le livre ${updatedOuvrage.name} dont l'id vaut ${updatedOuvrage.idOuvrage} a été mis à jour avec succès !`;
				// Retourner la réponse HTTP en json avec le msg et le livre créé
				res.json(success(message, updatedOuvrage));
			});
		})
		.catch((error) => {
			const message =
				"Le livre n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

export { OuvragesRouter };
