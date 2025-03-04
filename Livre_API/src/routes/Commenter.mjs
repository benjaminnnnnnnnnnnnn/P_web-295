import express from "express";
import { Commenter } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const CommenterRouter = express();

/**
* @swagger
* /api/Commenter/:
*   get:
*     tags: [Commenter]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all Commenter.
*     description: Retrieve all comments. Can be used to populate a select HTML tag.
*     parameters:
*       - in: query
*         name: nom
*         required: false
*         description: name of the comment to search for.
*         schema:
*           type: string
*       - in: query
*         name: limit
*         required: false
*         description: number of comments to return.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: All comments.
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
*                     description: The book ID.
*                     example: 1
*                    idUtilisateur:
*                     type: integer
*                     description: The user ID.
*                     example: 1
*                   commentaire:
*                     type: string
*                     description: The comment itself.
*                     example: Pas mal le livre
*
*/
CommenterRouter.get("/", auth, (req, res) => {
	if (req.query.nom) {
		if (req.query.nom.length < 2) {
			const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
			return res.status(400).json({ message });
		}
		let limit = 3;
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
		}
		return Commenter.findAndCountAll({
			where: { nomCommentaire: { [Op.like]: `%${req.query.nom}%` } },
			order: ["nomCommentaire"],
			limit: limit,
		}).then((Commenter) => {
			const message = `Il y a ${Commenter.count} commentaires qui correspondent au terme de la recherche`;
			res.json(success(message, Commenter));
		});
	}
	Commenter.findAll({ order: ["nomCommentaire"] })
		.then((Commenter) => {
			const message = "La liste des commentaires a bien été récupérée.";
			res.json(success(message, Commenter));
		})
		.catch((error) => {
			const message =
				"La liste des commentaires n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});
/**
* @swagger
* /api/Commenter/{idUtilisateur}/{idOuvrage}:
*   get:
*     tags: [Commenter]
*     security:
*       - bearerAuth: []
*     summary: find Commenter my id.
*     description: find Commenter by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: idUtilisateur
*         required: true
*         description: id of the user to search for.
*         schema:
*           type: integer
*       - in: path
*         name: idOuvrage
*         required: true
*         description: id of the book to search for.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: All comments.
*         content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   idUtilisateur:
*                     type: integer
*                     description: The user's ID.
*                     example: 1
*                   idOuvrage:
*                     type: integer
*                     description: The book's ID.
*                     example: 1
*                   commentaire:
*                     type: string
*                     description: The comment itself.
*                     example: Pas mal le livre
*
*/
CommenterRouter.get("/:idUtilisateur/:idOuvrage", auth, (req, res) => {
	Commenter.findOne({ where: { idUtilisateur: req.params.idUtilisateur, idOuvrage: req.params.idOuvrage } })
		.then((Commenter) => {
			if (Commenter === null) {
				const message =
					"Le commentaire demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			const message = `Le commentaire dont l'id vaut ${Commenter.idUtilisateur} et l'id de l'ouvrage vaut ${Commenter.idOuvrage} a bien été récupéré.`;
			res.json(success(message, Commenter));
		})
		.catch((error) => {
			const message =
				"Le commentaire n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Commenter/:
*   post:
*     tags: [Commenter]
*     security:
*       - bearerAuth: []
*     summary: Add an new comment.
*     description: Add an comment. Can be used to populate a select HTML tag.
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Comment'
*     responses:
*       200:
*         description: All comments.
*components:
*  schemas:
*    Commenter:
*      type: object
*      properties:
*        idUtilisateur:
*          type: integer
*          description: The user's ID.
*          example: 1
*        idOuvrage:
*          type: integer
*          description: The book's id.
*          example: 1
*        commentaire:
*          type: string
*          description: The comment itself.
*          example: Pas mal le livre
*      required:
*        - idUtilisateur
*        - idOuvrage
*        - commentaire
*/
CommenterRouter.post("/", auth, (req, res) => {
	Commenter.create(req.body)
		.then((createdCommentaire) => {
			// Définir un message pour le consommateur de l'API REST
			const message = `Le commentaire ${createdCommentaire.Commmenter} a bien été créé !`;
			// Retourner la réponse HTTP en json avec le msg et le commentaire créé
			res.json(success(message, createdCommentaire));
		})
		.catch((error) => {
			if (error instanceof ValidationError) {
				return res.status(400).json({ message: error.message, data: error });
			}
			const message =
				"Le commentaire n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Commenter/{idUtilisateur}/{idOuvrage}:
*   delete:
*     tags: [Commenter]
*     security:
*       - bearerAuth: []
*     summary: destroy comment by id.
*     description: find comments by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: idUtilisateur
*         required: true
*         description: id of the user to destroy.
*         schema:
*           type: integer
*       - in: path
*         name: idOuvrage
*         required: true
*         description: id of the book to destroy.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: All comments.
*         content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   idUtilisateur:
*                     type: integer
*                     description: The user ID.
*                     example: 1
*                   idOuvrage:
*                     type: integer
*                     description: The book ID.
*                     example: 1
*                   commentaire:
*                     type: string
*                     description: The comment itself.
*                     example: Pas mal le livre
*
*/
CommenterRouter.delete("/:idUtilisateur/:idOuvrage", auth, (req, res) => {
	Commenter.findOne({ where: { idUtilisateur: req.params.idUtilisateur, idOuvrage: req.params.idOuvrage } })
		.then((deletedCommenter) => {
			if (deletedCommenter === null) {
				const message =
					"Le commentaire demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			return Commenter.destroy({
				where: { idUtilisateur: deletedCommenter.idUtilisateur, idUtilisateur: deletedCommenter.idUtilisateur },
			}).then((_) => {
				// Définir un message pour le consommateur de l'API REST
				const message = `Le commentaire ${deletedCommenter.comment} a bien été supprimé !`;
				// Retourner la réponse HTTP en json avec le msg et le commentaire créé
				res.json(success(message, deletedCommenter));
			});
		})
		.catch((error) => {
			const message =
				"Le commentaire n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Commenter/{id}:
*   put:
*     tags: [Commenter]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all comments.
*     description: Retrieve all comments. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the categorie to destroy.
*         schema:
*           type: integer
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Categorie'
*     responses:
*       200:
*         description: All Categories.
*         content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   idCategorie:
*                     type: integer
*                     description: The Categorie ID.
*                     example: 1
*                   nomCategorie:
*                     type: string
*                     description: The Categorie's name.
*                     example: Categorie 1
*components:
*  schemas:
*    Categorie:
*      type: object
*      properties:
*        nomCategorie:
*          type: string
*          description: The Categorie's name.
*          example: Categorie 1
*        idCategorie:
*          type: integer
*          description: The Categorie's id.
*          example: 1
*      required:
*        - nomCategorie
*        - idCategorie
*/
CommenterRouter.put("/:id", auth, (req, res) => {
	const CategorieId = req.params.id;
	Categorie.update(req.body, { where: { idCategorie: CategorieId } })
		.then((_) => {
			return Categorie.findByPk(CategorieId).then((updatedCategorie) => {
				if (updatedCategorie === null) {
					const message =
						"Le Categorie demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
					// A noter ici le return pour interrompre l'exécution du code
					return res.status(404).json({ message });
				}
				// Définir un message pour l'utilisateur de l'API REST
				const message = `Le Categorie ${updatedCategorie.nomCategorie} dont l'id vaut ${updatedCategorie.idCategorie} a été mis à jour avec succès !`;
				// Retourner la réponse HTTP en json avec le msg et le Categorie créé
				res.json(success(message, updatedCategorie));
			});
		})
		.catch((error) => {
			const message =
				"Le Categorie n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

export { CommenterRouter };
