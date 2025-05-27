import express from "express";
import { Categorie, Ouvrage } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const CategoriesRouter = express();

/**
* @swagger
* /api/Categories/:
*   get:
*     tags: [Categories]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all Categories.
*     description: Retrieve all Categories. Can be used to populate a select HTML tag.
*     parameters:
*       - in: query
*         name: nom
*         required: false
*         description: name of the categorie to search for.
*         schema:
*           type: string
*       - in: query
*         name: limit
*         required: false
*         description: number of categorie to return.
*         schema:
*           type: integer
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
*
*/
CategoriesRouter.get("/", (req, res) => {
	if (req.query.nom) {
		if (req.query.nom.length < 2) {
			const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
			return res.status(400).json({ message });
		}
		let limit = 3;
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
		}
		return Categorie.findAndCountAll({
			where: { nomCategorie: { [Op.like]: `%${req.query.nom}%` } },
			order: ["nomCategorie"],
			limit: limit,
		}).then((Categories) => {
			const message = `Il y a ${Categories.count} Categorie qui correspondent au terme de la recherche`;
			res.json(success(message, Categories));
		});
	}
	Categorie.findAll({ order: ["nomCategorie"] })
		.then((Categories) => {
			const message = "La liste des Categories a bien été récupérée.";
			res.json(success(message, Categories));
		})
		.catch((error) => {
			const message =
				"La liste des Categories n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});
/**
* @swagger
* /api/Categories/{id}:
*   get:
*     tags: [Categories]
*     security:
*       - bearerAuth: []
*     summary: find Categorie my id.
*     description: find Categories by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the categorie to search for.
*         schema:
*           type: integer
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
*
*/
CategoriesRouter.get("/:id", (req, res) => {
	Categorie.findByPk(req.params.id)
		.then((Categorie) => {
			if (Categorie === null) {
				const message =
					"Le Categorie demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			const message = `Le Categorie dont l'id vaut ${Categorie.idCategorie} a bien été récupéré.`;
			res.json(success(message, Categorie));
		})
		.catch((error) => {
			const message =
				"Le Categorie n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Categories/:
*   post:
*     tags: [Categories]
*     security:
*       - bearerAuth: []
*     summary: Add an new Categories.
*     description: Add an Categories. Can be used to populate a select HTML tag.
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
CategoriesRouter.post("/", auth, (req, res) => {
	Categorie.create(req.body)
		.then((createdCategorie) => {
			// Définir un message pour le consommateur de l'API REST
			const message = `Le Categorie ${createdCategorie.nomCategorie} a bien été créé !`;
			// Retourner la réponse HTTP en json avec le msg et le Categorie créé
			res.json(success(message, createdCategorie));
		})
		.catch((error) => {
			if (error instanceof ValidationError) {
				return res.status(400).json({ message: error.message, data: error });
			}
			const message =
				"Le Categorie n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Categories/{id}:
*   delete:
*     tags: [Categories]
*     security:
*       - bearerAuth: []
*     summary: destroy Categorie by id.
*     description: find Categories by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the categorie to destroy.
*         schema:
*           type: integer
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
*
*/
CategoriesRouter.delete("/:id", auth, (req, res) => {
	Categorie.findByPk(req.params.id)
		.then((deletedCategorie) => {
			if (deletedCategorie === null) {
				const message =
					"Le Categorie demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
				// A noter ici le return pour interrompre l'exécution du code
				return res.status(404).json({ message });
			}
			return Categorie.destroy({
				where: { idCategorie: deletedCategorie.idCategorie },
			}).then((_) => {
				// Définir un message pour le consommateur de l'API REST
				const message = `Le Categorie ${deletedCategorie.nomCategorie} a bien été supprimé !`;
				// Retourner la réponse HTTP en json avec le msg et le Categorie créé
				res.json(success(message, deletedCategorie));
			});
		})
		.catch((error) => {
			const message =
				"Le Categorie n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});

/**
* @swagger
* /api/Categories/{id}:
*   put:
*     tags: [Categories]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all Categories.
*     description: Retrieve all Categories. Can be used to populate a select HTML tag.
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
CategoriesRouter.put("/:id", auth, (req, res) => {
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

/**
* @swagger
* /api/Categories/{id}/Livres:
*   get:
*     tags: [Categories]
*     security:
*       - bearerAuth: []
*     summary: find all Ouvrage in a Categorie.
*     description: find Ouvrage in a Categories by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the categorie to search for.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: All Categories.
*
*/
CategoriesRouter.get("/:id/Livres", auth, (req, res) => {
    Categorie.findByPk(req.params.id, { include: Ouvrage })
        .then((Categorie) => {
            if (!Categorie) {
                const message = "La categorie demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
                return res.status(404).json({ message });
            }

            return Ouvrage.findAll({
                where: { idCategorie: Categorie.idCategorie },
                order: [["titre", "ASC"]],
            }).then((ouvrages) => {
                const message = `Les livres de la categorie ${Categorie.nomCategorie} ont bien été récupérés.`;
                res.json(success(message, ouvrages));
            });
        })
        .catch((error) => {
            const message = "Impossible de récupérer les données. Réessayez plus tard, oui...";
            res.status(500).json({ message, data: error });
        });
});



export { CategoriesRouter };
