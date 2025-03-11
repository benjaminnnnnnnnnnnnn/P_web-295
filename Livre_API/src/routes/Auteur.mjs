import express from "express";
import { Auteur, Ouvrage } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { auth } from "../auth/auth.mjs";

const AuteursRouter = express();

/**
* @swagger
* /api/auteurs/:
*   get:
*     tags: [Auteurs]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all auteur.
*     description: Retrieve all auteur. Can be used to populate a select HTML tag.
*     responses:
*       200:
*         description: All auteur.
*         content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   idAuteur:
*                     type: integer
*                     description: The auteur ID.
*                     example: 1
*                   nomAuteur:
*                     type: string
*                     description: The auteur name.
*                     example: "Doe"
*                   prenomAuteur:
*                     type: string
*                     description: The auteur firstname.
*                     example: "John"
*
*/
AuteursRouter.get("/", auth, (req, res) => {
	Auteur.findAll({})
		.then((Auteur) => {
			const message = "La liste des auteur a bien été récupérée.";
			res.json(success(message, Auteur));
		})
		.catch((error) => {
			const message =
				"La liste des auteur n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
			res.status(500).json({ message, data: error });
		});
});


/**
* @swagger
* /api/auteurs/{id}:
*   get:
*     tags: [Auteurs]
*     security:
*       - bearerAuth: []
*     summary: Retrieve all Auteur by id.
*     description: Retrieve all Auteur by id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the auteur to retrieve.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: All Auteur.
*
*/
AuteursRouter.get("/:id", auth, (req, res) => {
    Auteur.findByPk(req.params.id)
        .then((Auteur) => {
            if (Auteur === null) {
                const message =
                    "Le auteur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
                // A noter ici le return pour interrompre l'exécution du code
                return res.status(404).json({ message });
            }
            const message = `Le auteur dont l'id vaut ${Auteur.idAuteur} a bien été récupéré.`;
            res.json(success(message, Auteur));
        })
        .catch((error) => {
            const message =
                "Le livre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});


/**
* @swagger
* /api/auteurs/{id}/Livres:
*   get:
*     tags: [Auteurs]
*     security:
*       - bearerAuth: []
*     summary: find all Ouvrage by an auteur.
*     description: find Ouvrage by an auteur id. Can be used to populate a select HTML tag.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: id of the auteur to search for.
*         schema:
*           type: integer
*     responses:
*       200:
*         description: All ouvrage.
*
*/
AuteursRouter.get("/:id/Livres", auth, (req, res) => {
    Auteur.findByPk(req.params.id, { include: Ouvrage })
        .then((auteur) => {
            if (!auteur) {
                const message = "L'auteur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
                return res.status(404).json({ message });
            }

            return Ouvrage.findAll({
                where: { idAuteur: auteur.idAuteur },
                order: [["titre", "ASC"]],
            }).then((ouvrages) => {
                const message = `Les livres de l'auteur ${auteur.nomAuteur} ${auteur.prenomAuteur} ont bien été récupérés.`;
                res.json(success(message, ouvrages));
            });
        })
        .catch((error) => {
            const message = "Impossible de récupérer les données. Réessayez plus tard, oui...";
            res.status(500).json({ message, data: error });
        });
});

export { AuteursRouter };
