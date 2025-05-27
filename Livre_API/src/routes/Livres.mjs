import express from "express";
import {
  Ouvrage,
  Categorie,
  Commenter,
  User,
  Apprecier,
} from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
const OuvragesRouter = express();

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/bookcovers"); // We puts the images here, yes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Gives it a name, precious
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/Livres/:
 *   get:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all Ouvrages.
 *     description: Retrieve all Ouvrages. Can be used to populate a select HTML tag.
 *     parameters:
 *       - in: query
 *         titre: titre
 *         required: false
 *         description: title of the book to search for.
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
 *                     description: The Ouvrage's number of pages.
 *                     example: 5
 *                   extrait:
 *                     type: string
 *                     description: The Ouvrage's quote.
 *                     example: extrait
 *                   resume:
 *                     type: string
 *                     description: The Ouvrage's description.
 *                     example: resume
 *                   nomAuteur:
 *                     type: string
 *                     description: The Ouvrage's auter family name.
 *                     example: nomAuteur
 *                   prenomAuteur:
 *                     type: string
 *                     description: The Ouvrage's auter name.
 *                     example: prenomAuteur
 *                   nomEditeur:
 *                     type: string
 *                     description: The Ouvrage's editor name.
 *                     example: nomEditeur
 *                   anneeEdition:
 *                     type: number
 *                     description: The Ouvrage's edition date.
 *                     example: 2021
 *                   moyenneAppreciation:
 *                     type: number
 *                     description: The Ouvrage's global note.
 *                     example: 5
 *                   imageCouverture:
 *                     type: string
 *                     description: The Ouvrage's front cover.
 *                     example: imageCouverture
 *                   idCategorie:
 *                     type: number
 *                     description: The Ouvrage's categorie.
 *                     example: 1
 *                   idAuteur:
 *                     type: number
 *                     description: The Ouvrage's auteur.
 *                     example: 1
 *                   idEditeur:
 *                     type: number
 *                     description: The Ouvrage's editor.
 *                     example: 1
 *
 */
OuvragesRouter.get("/", (req, res) => {
	if (req.query.titre) {
		if (req.query.titre.length < 1) {
			const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
			return res.status(400).json({ message });
		}
		let limit = 50;
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
		}
		
		if (req.query.categorie >= 0) {
			console.log(req.query.categorie)
			return Ouvrage.findAndCountAll({
				include: Categorie,
				where: {
					titre: { [Op.like]: `%${req.query.titre}%` },
					idCategorie: req.query.categorie,
				},
				order: [["createdAt","DESC"],["titre", "DESC"]],
				limit: limit,
			}).then((Ouvrages) => {
				const message = `Il y a ${Ouvrages.count} livre qui correspondent au terme de la recherche`;
				res.json(success(message, Ouvrages));
			});
		} else {
			return Ouvrage.findAndCountAll({
				include: Categorie,
				where: { titre: { [Op.like]: `%${req.query.titre}%` } },
				order: [["createdAt","DESC"],["titre", "ASC"]],
				limit: limit,
			}).then((Ouvrages) => {
				const message = `Il y a ${Ouvrages.count} livre qui correspondent au terme de la recherche`;
				res.json(success(message, Ouvrages));
			});
		}
	}

	if (req.query.categorie >= 0) {
		console.log(req.query.categorie)
		return Ouvrage.findAndCountAll({
			include: Categorie,
			where: {
				titre: { [Op.like]: `%${req.query.titre}%` },
				idCategorie: req.query.categorie,
			},
			order: [["createdAt","DESC"],["titre", "ASC"]],
		}).then((Ouvrages) => {
			const message = `Il y a ${Ouvrages.count} livre qui correspondent au terme de la recherche`;
			res.json(success(message, Ouvrages));
		});
	}
  else {
	  Ouvrage.findAll({ include: Categorie, order: [["createdAt","DESC"],["titre", "ASC"]], })
		.then((Ouvrages) => {
		  const message = "La liste des livres a bien été récupérée.";
		  res.json(success(message, Ouvrages));
		})
		.catch((error) => {
		  const message =
			"La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
		  res.status(500).json({ message, data: error });
		});
  }
});
/**
 * @swagger
 * /api/Livres/{id}:
 *   get:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all Ouvrages.
 *     description: Retrieve all Ouvrages. Can be used to populate a select HTML tag.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the User to retrieve.
 *         schema:
 *           type: integer
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
 *                     description: The Ouvrage's number of pages.
 *                     example: 5
 *                   extrait:
 *                     type: string
 *                     description: The Ouvrage's quote.
 *                     example: extrait
 *                   resume:
 *                     type: string
 *                     description: The Ouvrage's description.
 *                     example: resume
 *                   nomAuteur:
 *                     type: string
 *                     description: The Ouvrage's auter family name.
 *                     example: nomAuteur
 *                   prenomAuteur:
 *                     type: string
 *                     description: The Ouvrage's auter name.
 *                     example: prenomAuteur
 *                   nomEditeur:
 *                     type: string
 *                     description: The Ouvrage's editor name.
 *                     example: nomEditeur
 *                   anneeEdition:
 *                     type: number
 *                     description: The Ouvrage's edition date.
 *                     example: 2021
 *                   moyenneAppreciation:
 *                     type: number
 *                     description: The Ouvrage's global note.
 *                     example: 5
 *                   imageCouverture:
 *                     type: string
 *                     description: The Ouvrage's front cover.
 *                     example: imageCouverture
 *                   idCategorie:
 *                     type: number
 *                     description: The Ouvrage's categorie.
 *                     example: 1
 *                   idAuteur:
 *                     type: number
 *                     description: The Ouvrage's auteur.
 *                     example: 1
 *                   idEditeur:
 *                     type: number
 *                     description: The Ouvrage's editor.
 *                     example: 1
 *
 */
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

/**
 * @swagger
 * /api/Livres/:
 *   post:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all Ouvrages.
 *     description: Retrieve all Ouvrages. Can be used to populate a select HTML tag.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ouvrage'
 *     responses:
 *       200:
 *         description: All Ouvrages.
 *components:
 *  schemas:
 *    Ouvrage:
 *      type: object
 *      properties:
 *        titre:
 *          type: string
 *          description: The Ouvrage's name.
 *          example: Livre 1
 *        nbPages:
 *          type: number
 *          description: The Ouvrage's number of pages.
 *          example: 5
 *        extrait:
 *          type: string
 *          description: The Ouvrage's quote.
 *          example: extrait
 *        resume:
 *          type: string
 *          description: The Ouvrage's description.
 *          example: resume
 *        nomAuteur:
 *          type: string
 *          description: The Ouvrage's auter family name.
 *          example: nomAuteur
 *        prenomAuteur:
 *          type: string
 *          description: The Ouvrage's auter name.
 *          example: prenomAuteur
 *        nomEditeur:
 *          type: string
 *          description: The Ouvrage's editor name.
 *          example: nomEditeur
 *        anneeEdition:
 *          type: number
 *          description: The Ouvrage's edition date.
 *          example: 2021
 *        moyenneAppreciation:
 *          type: number
 *          description: The Ouvrage's global note.
 *          example: 5
 *        imageCouverture:
 *          type: string
 *          description: The Ouvrage's front cover.
 *          example: imageCouverture
 *        idCategorie:
 *          type: number
 *          description: The Ouvrage's categorie.
 *          example: 1
 *        idAuteur:
 *          type: number
 *          description: The Ouvrage's auteur.
 *          example: 1
 *        idEditeur:
 *          type: number
 *          description: The Ouvrage's editor.
 *          example: 1
 *      required:
 *        - titre
 *        - nbPages
 *        - idCategorie
 *        - idAuteur
 *        - idEditeur
 */
OuvragesRouter.post("/", auth, upload.single("imageCouverture"), (req, res) => {
  const data = {
    ...req.body,
    imageCouverture: req.file
      ? `/public/bookCovers/${req.file.filename}`
      : null,
  };

  Ouvrage.create(data)
    .then((createdOuvrage) => {
      const message = `Le livre ${createdOuvrage.titre} a bien été créé avec une image !`;
      res.json(success(message, createdOuvrage));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message = "Le livre n'a pas pu être ajouté, même avec l'image !";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/Livres/{id}:
 *   delete:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: delte an Ouvrages.
 *     description: delete an Ouvrages using the Ouvrage id. Can be used to populate a select HTML tag.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Ouvrage to destroy.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All Ouvrages.
 *
 */
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

/**
 * @swagger
 * /api/Livres/{id}:
 *   put:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all Ouvrages.
 *     description: Retrieve all Ouvrages. Can be used to populate a select HTML tag.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Ouvrage to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ouvrage'
 *     responses:
 *       200:
 *         description: All Ouvrages.
 *components:
 *  schemas:
 *    Ouvrage:
 *      type: object
 *      properties:
 *        titre:
 *          type: string
 *          description: The Ouvrage's name.
 *          example: Livre 1
 *        nbPages:
 *          type: number
 *          description: The Ouvrage's number of pages.
 *          example: 5
 *        extrait:
 *          type: string
 *          description: The Ouvrage's quote.
 *          example: extrait
 *        resume:
 *          type: string
 *          description: The Ouvrage's description.
 *          example: resume
 *        nomAuteur:
 *          type: string
 *          description: The Ouvrage's auter family name.
 *          example: nomAuteur
 *        prenomAuteur:
 *          type: string
 *          description: The Ouvrage's auter name.
 *          example: prenomAuteur
 *        nomEditeur:
 *          type: string
 *          description: The Ouvrage's editor name.
 *          example: nomEditeur
 *        anneeEdition:
 *          type: number
 *          description: The Ouvrage's edition date.
 *          example: 2021
 *        moyenneAppreciation:
 *          type: number
 *          description: The Ouvrage's global note.
 *          example: 5
 *        imageCouverture:
 *          type: string
 *          description: The Ouvrage's front cover.
 *          example: imageCouverture
 *        idCategorie:
 *          type: number
 *          description: The Ouvrage's categorie.
 *          example: 1
 *        idAuteur:
 *          type: number
 *          description: The Ouvrage's auteur.
 *          example: 1
 *        idEditeur:
 *          type: number
 *          description: The Ouvrage's editor.
 *          example: 1
 *      required:
 *        - titre
 *        - nbPages
 *        - idCategorie
 *        - idAuteur
 *        - idEditeur
 */
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
        const message = `Le livre ${updatedOuvrage.titre} dont l'id vaut ${updatedOuvrage.idOuvrage} a été mis à jour avec succès !`;
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

/**
 * @swagger
 * /api/Livres/{id}/comments:
 *   get:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all comments for a specific book.
 *     description: Retrieve all comments associated with a book ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to retrieve comments for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All comments for the specified book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idOuvrage:
 *                         type: integer
 *                         description: The book ID.
 *                         example: 1
 *                       idUtilisateur:
 *                         type: integer
 *                         description: The user ID who made the comment.
 *                         example: 1
 *                       commentaire:
 *                         type: string
 *                         description: The comment text.
 *                         example: "Tres bon livre"
 */
OuvragesRouter.get("/:id/comments", auth, (req, res) => {
  const bookId = req.params.id;

  // Find the book first to verify it exists
  Ouvrage.findByPk(bookId)
    .then((ouvrage) => {
      if (ouvrage === null) {
        const message =
          "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }

      // Try to get comments without the User include first to simplify
      return Commenter.findAll({
        where: { idOuvrage: bookId },
      }).then((comments) => {
        const message = comments.length
          ? `${comments.length} commentaire(s) trouvé(s) pour le livre "${ouvrage.titre}".`
          : `Aucun commentaire trouvé pour le livre "${ouvrage.titre}".`;

        res.json(success(message, comments));
      });
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
      const message =
        "La liste des commentaires n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/Livres/{id}/appreciations:
 *   get:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all appreciations for a specific book.
 *     description: Retrieve all ratings associated with a book ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to retrieve appreciations for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All appreciations for the specified book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idOuvrage:
 *                         type: integer
 *                         description: The book ID.
 *                         example: 1
 *                       idUtilisateur:
 *                         type: integer
 *                         description: The user ID who gave the rating.
 *                         example: 1
 *                       appreciation:
 *                         type: integer
 *                         description: The rating value.
 *                         example: 5
 */
OuvragesRouter.get("/:id/appreciations", auth, (req, res) => {
  const bookId = req.params.id;

  // Add console.log to debug
  console.log(`Fetching appreciations for book ID: ${bookId}`);

  // Find the book first to verify it exists
  Ouvrage.findByPk(bookId)
    .then((ouvrage) => {
      if (ouvrage === null) {
        const message =
          "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }

      // Find all appreciations for this book - using simpler query without joins for now
      console.log(`Book "${ouvrage.titre}" found, fetching appreciations...`);

      return Apprecier.findAll({
        where: { idOuvrage: bookId },
      }).then((appreciations) => {
        console.log(`Found ${appreciations.length} appreciations`);

        const message = appreciations.length
          ? `${appreciations.length} appréciation(s) trouvée(s) pour le livre "${ouvrage.titre}".`
          : `Aucune appréciation trouvée pour le livre "${ouvrage.titre}".`;

        res.json(success(message, appreciations));
      });
    })
    .catch((error) => {
      console.error("Error fetching appreciations:", error);
      const message =
        "La liste des appréciations n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/Livres/{id}/comments:
 *   post:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Add a comment to a book.
 *     description: Add a new comment to a specific book.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to add a comment to.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUtilisateur:
 *                 type: integer
 *                 description: ID of the user making the comment.
 *                 example: 1
 *               commentaire:
 *                 type: string
 *                 description: The content of the comment.
 *                 example: "Un excellent livre que je recommande fortement."
 *             required:
 *               - idUtilisateur
 *               - commentaire
 *     responses:
 *       200:
 *         description: Comment successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Le commentaire a été ajouté avec succès."
 *                 data:
 *                   type: object
 *                   properties:
 *                     idOuvrage:
 *                       type: integer
 *                       example: 1
 *                     idUtilisateur:
 *                       type: integer
 *                       example: 1
 *                     commentaire:
 *                       type: string
 *                       example: "Un excellent livre que je recommande fortement."
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error.
 */
OuvragesRouter.post("/:id/comments", auth, (req, res) => {
  const bookId = req.params.id;

  // Verify the book exists
  Ouvrage.findByPk(bookId)
    .then((ouvrage) => {
      if (ouvrage === null) {
        const message =
          "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }

      // Create comment with book ID from path and user ID & comment from body
      const commentData = {
        idOuvrage: bookId,
        idUtilisateur: req.body.idUtilisateur,
        commentaire: req.body.commentaire,
      };

      return Commenter.create(commentData).then((comment) => {
        const message = `Le commentaire a été ajouté avec succès au livre "${ouvrage.titre}".`;
        res.json(success(message, comment));
      });
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
 * /api/Livres/{id}/appreciations:
 *   post:
 *     tags: [Ouvrages]
 *     security:
 *       - bearerAuth: []
 *     summary: Rate a book.
 *     description: Add or update a rating for a specific book.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to rate.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUtilisateur:
 *                 type: integer
 *                 description: ID of the user rating the book.
 *                 example: 1
 *               appreciation:
 *                 type: integer
 *                 description: Rating value (typically 0-5).
 *                 example: 4
 *             required:
 *               - idUtilisateur
 *               - appreciation
 *     responses:
 *       200:
 *         description: Rating successfully added or updated.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error.
 */
OuvragesRouter.post("/:id/appreciations", auth, (req, res) => {
  const bookId = req.params.id;

  console.log(`Adding/updating appreciation for book ID: ${bookId}`, req.body);

  // Verify the book exists
  Ouvrage.findByPk(bookId)
    .then((ouvrage) => {
      if (ouvrage === null) {
        const message =
          "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }

      // Validate rating value
      const ratingValue = parseInt(req.body.appreciation);
      if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
        const message = "La note doit être un nombre entier entre 0 et 5.";
        return res.status(400).json({ message });
      }

      // Check if the user has already rated this book
      return Apprecier.findOne({
        where: {
          idOuvrage: bookId,
          idUtilisateur: req.body.idUtilisateur,
        },
      }).then((existingRating) => {
        if (existingRating) {
          // Update existing rating
          return existingRating
            .update({
              appreciation: ratingValue,
            })
            .then((updatedRating) => {
              const message = `Votre note pour le livre "${ouvrage.titre}" a été mise à jour.`;
              res.json(success(message, updatedRating));
            });
        } else {
          // Create new rating
          const ratingData = {
            idOuvrage: bookId,
            idUtilisateur: req.body.idUtilisateur,
            appreciation: ratingValue,
          };

          return Apprecier.create(ratingData).then((newRating) => {
            const message = `Votre note pour le livre "${ouvrage.titre}" a été enregistrée.`;
            res.json(success(message, newRating));
          });
        }
      });
    })
    .catch((error) => {
      console.error("Error saving appreciation:", error);
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "La note n'a pas pu être enregistrée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

OuvragesRouter.get("/:id/image", (req, res) => {
  Ouvrage.findByPk(req.params.id)
    .then((ouvrage) => {
      if (!ouvrage || !ouvrage.imageCouverture) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json(
        success("Image retrieved successfully", {
          imageCouverture: ouvrage.imageCouverture,
        })
      );
    })
    .catch((error) => {
      res.status(500).json({ message: "Error retrieving image.", data: error });
    });
});

// PUT image route: updates/uploads bookcover image for a specific book
OuvragesRouter.put(
  "/:id/image",
  auth,
  upload.single("imageCouverture"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imagePath = `/${req.file.filename}`;

    Ouvrage.findByPk(req.params.id)
      .then((ouvrage) => {
        if (!ouvrage) {
          return res
            .status(404)
            .json({ message: "Book not found to update image." });
        }
        return ouvrage
          .update({ imageCouverture: imagePath })
          .then((updated) => {
            res.json(success("Image updated successfully", updated));
          });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "Could not update image.", data: error });
      });
  }
);

export { OuvragesRouter };
