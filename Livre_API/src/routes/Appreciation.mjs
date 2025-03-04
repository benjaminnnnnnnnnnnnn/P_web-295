import express from "express";
import { Apprecier } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const AppreciationRouter = express();

/**
* @swagger
* /api/Appreciation/:
*   get:
*     tags: [Appreciation]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all Appreciation.
*     description: Retrieve all Appreciation. Can be used to populate a select HTML tag.
*     parameters:
*       - in: query
*         name: note
*         required: false
*         description: note d'appreciation.
*         schema:
*           type: float
*     responses:
*       200:
*         description: All Appreciation.
*/
AppreciationRouter.get("/", auth, (req, res) => {
	if (req.query.note) {
		if (req.query.note > 10 || req.query.note < 0) {
            const message = `La note doit être comprise entre 0 et 10`;
			return res.status(400).json({ message });
		}
		let limit = 3;
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
		}
		return Apprecier.findAndCountAll({
			where: { Appreciation: { [Op.gt]: `${req.query.note}` } },
			order: ["Appreciation"],
			limit: limit,
		}).then((Appreciation) => {
			const message = `Il y a ${Appreciation.count} Apprecier qui correspondent au terme de la recherche`;
			res.json(success(message, Appreciation));
		});
	}
	Apprecier.findAll({ order: ["Appreciation"] })
		.then((Appreciation) => {
			const message = "La liste des Appreciation a bien été récupérée.";
			res.json(success(message, Appreciation));
		})
		.catch((error) => {
			const message =
				"La liste des Appreciation n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});
/**
* @swagger
* /api/Appreciation/{id}:
*   get:
*     tags: [Appreciation]
*     security:
*       - bearerAuth: []
*     summary: find Apprecier my id.
*     description: find Appreciation by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the appreciation tu search for.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: All Appreciation.
*/
AppreciationRouter.get("/:id", auth, (req, res) => {
	Apprecier.findByPk(req.params.id)
    .then((Apprecier) => {
			if (Apprecier === null) {
				const message =
					"Le Apprecier demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			const message = `Le Apprecier dont l'id vaut ${Apprecier.id} a bien été récupéré.`;
			res.json(success(message, Apprecier));
		})
		.catch((error) => {
			const message =
				"Le Apprecier n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Appreciation/:
*   post:
*     tags: [Appreciation]
*     security:
*       - bearerAuth: []
*     summary: Add an new Appreciation.
*     description: Add an Appreciation. Can be used to populate a select HTML tag.
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Apprecier'
*     responses:
*       200:
*         description: All Appreciation.
*components:
*  schemas:
*    Apprecier:
*      type: object
*      properties:
*       id:
*         type: integer
*         description: The Apprecier's id.
*         example: 1
*       idUtilisateur:
*         type: integer
*         description: The Apprecier's idUtilisateur.
*         example: 1
*       idOuvrage:
*         type: integer
*         description: The Apprecier's idOuvrage.
*         example: 1
*       appreciation:
*         type: integer
*         description: The Apprecier's Appreciation.
*         example: 5
*      required:
*        - idUtilisateur
*        - idOuvrage
*        - appreciation
*/
AppreciationRouter.post("/", auth, (req, res) => {
    Apprecier.findAll({
        where: { idUtilisateur: req.body.idUtilisateur, idOuvrage: req.body.idOuvrage },
    }).then((Apprecier) => {
        console.log(Apprecier);
        if (Apprecier !== null) {
            const message =
            `L'utilisateur avec l'id ${req.body.idUtilisateur} a déjà noté l'ouvrage avec l'id ${req.body.idOuvrage}.`;
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
        }})
	Apprecier.create(req.body)
		.then((createdApprecier) => {
			// Définir un message pour le consommateur de l'API REST
			const message = `Le Apprecier avec l'id ${createdApprecier.id} a bien été créé !`;
			// Retourner la réponse HTTP en json avec le msg et le Apprecier créé
			res.json(success(message, createdApprecier));
		})
		.catch((error) => {
			if (error instanceof ValidationError) {
				return res.status(400).json({ message: error.message, data: error });
			}
			const message =
				"Le Apprecier n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Appreciation/{id}:
*   delete:
*     tags: [Appreciation]
*     security:
*       - bearerAuth: []
*     summary: destroy Apprecier by id.
*     description: find Appreciation by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the Apprecier to destroy.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: appreciation destroyed.
*       404:
*         description: appreciation not found.
*       418:
*         description: I'm a teapot.
*       500:
*         description: internal error.
*
*/
AppreciationRouter.delete("/:id", auth, (req, res) => {
	Apprecier.findByPk(req.params.id)
		.then((deletedApprecier) => {
			if (deletedApprecier === null) {
				const message =
					"Le Apprecier demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			return Apprecier.destroy({
				where: { idApprecier: deletedApprecier.idApprecier },
			}).then((_) => {
				// Définir un message pour le consommateur de l'API REST
				const message = `Le Apprecier ${deletedApprecier.nomApprecier} a bien été supprimé !`;
				// Retourner la réponse HTTP en json avec le msg et le Apprecier créé
				res.json(success(message, deletedApprecier));
			});
		})
		.catch((error) => {
			const message =
				"Le Apprecier n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Appreciation/{id}:
*   put:
*     tags: [Appreciation]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all Appreciation.
*     description: Retrieve all Appreciation. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the Apprecier to destroy.
*         schema:
*           type: integer
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Apprecier'
*     responses:
*       200:
*         description: All Appreciation.
*         content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   idApprecier:
*                     type: integer
*                     description: The Apprecier ID.
*                     example: 1
*                   nomApprecier:
*                     type: string
*                     description: The Apprecier's name.
*                     example: Apprecier 1
*components:
*  schemas:
*    Apprecier:
*      type: object
*      properties:
*        nomApprecier:
*          type: string
*          description: The Apprecier's name.
*          example: Apprecier 1
*        idApprecier:
*          type: integer
*          description: The Apprecier's id.
*          example: 1
*      required:
*        - nomApprecier
*        - idApprecier
*/
AppreciationRouter.put("/:id", auth, (req, res) => {
	const ApprecierId = req.params.id;
	Apprecier.update(req.body, { where: { idApprecier: ApprecierId } })
		.then((_) => {
			return Apprecier.findByPk(ApprecierId).then((updatedApprecier) => {
				if (updatedApprecier === null) {
					const message =
						"Le Apprecier demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
					// A noter ici le return pour interrompre l'exécution du code
					return res.status(404).json({ message });
				}
				// Définir un message pour l'utilisateur de l'API REST
				const message = `Le Apprecier ${updatedApprecier.nomApprecier} dont l'id vaut ${updatedApprecier.idApprecier} a été mis à jour avec succès !`;
				// Retourner la réponse HTTP en json avec le msg et le Apprecier créé
				res.json(success(message, updatedApprecier));
			});
		})
		.catch((error) => {
			const message =
				"Le Apprecier n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

export { AppreciationRouter };
