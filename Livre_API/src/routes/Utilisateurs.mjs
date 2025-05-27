import express from "express";
import { User } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { privateKey } from "../auth/private_key.mjs";
const UserRouter = express();

/**
 * @swagger
 * /api/users/:
 *   get:
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all Users.
 *     description: Retrieve all Users. Can be used to populate a select HTML tag.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: Name of the User to search for.
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
 *         description: All Users.
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
 *                       idUtilisateur:
 *                         type: integer
 *                         description: The User's ID.
 *                         example: 1
 *                       nomUtilisateur:
 *                         type: string
 *                         description: The User's name.
 *                         example: hida
 *                       mdp:
 *                         type: string
 *                         description: The User's password.
 *                         example: $2b$10$yQJvL8QFiQG8fhTEJxfe9.h42UPRWEnjaOyDXuM/YdGMVU985qici
 *                       nbPropositions:
 *                         type: string
 *                         description: The number of propositions that the user made.
 *                         example: 5
 *                       createdAt:
 *                         type: datetime
 *                         description: The date and time that the user was created.
 *                         example: 2025-02-25 14:47:41
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
UserRouter.get("/", auth, (req, res) => {
  if (req.query.name) {
    if (req.query.name.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    return User.findAndCountAll({
      where: { nomUtilisateur: { [Op.like]: `%${req.query.name}%` } },
      order: ["nomUtilisateur"],
      limit: limit,
    }).then((Users) => {
      const message = `Il y a ${Users.count} utilisateur qui correspondent au terme de la recherche`;
      res.json(success(message, Users));
    });
  }
  User.findAll({ order: ["nomUtilisateur"] })
    .then((Users) => {
      const message = "La liste des utilisateurs a bien été récupérée.";
      res.json(success(message, Users));
    })
    .catch((error) => {
      const message =
        "La liste des utilisateurs n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});


UserRouter.get("/token", auth, (req, res) => {

  const message = `valid token`;

  res.json(success(message, ""));
});
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a User by ID.
 *     description: Retrieve a single User by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the User to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single User.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     idUtilisateur:
 *                       type: integer
 *                       description: The User's ID.
 *                       example: 1
 *                     nomUtilisateur:
 *                       type: string
 *                       description: The User's name.
 *                       example: hida
 *                     mdp:
 *                       type: string
 *                       description: The User's password.
 *                       example: $2b$10$yQJvL8QFiQG8fhTEJxfe9.h42UPRWEnjaOyDXuM/YdGMVU985qici
 *                     nbPropositions:
 *                       type: string
 *                       description: The number of propositions that the user made.
 *                       example: 5
 *                     createdAt:
 *                       type: datetime
 *                       description: The date and time that the user was created.
 *                       example: 2025-02-25 14:47:41
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
UserRouter.get("/:id", auth, (req, res) => {
  User.findByPk(req.params.id)
    .then((User) => {
      if (User === null) {
        const message =
          "Le utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      const message = `Le utilisateur dont l'id vaut ${User.idUtilisateur} a bien été récupéré.`;
      res.json(success(message, User));
    })
    .catch((error) => {
      const message =
        "Le utilisateur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/users/:
 *   post:
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     summary: add an new user.
 *     description: Add an user. Can be used to populate a select HTML tag.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: A single User.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     idUtilisateur:
 *                       type: integer
 *                       description: The User's ID.
 *                       example: 1
 *                     nomUtilisateur:
 *                       type: string
 *                       description: The User's name.
 *                       example: hida
 *                     mdp:
 *                       type: string
 *                       description: The User's password.
 *                       example: $2b$10$yQJvL8QFiQG8fhTEJxfe9.h42UPRWEnjaOyDXuM/YdGMVU985qici
 *                     nbPropositions:
 *                       type: string
 *                       description: The number of propositions that the user made.
 *                       example: 5
 *                     createdAt:
 *                       type: datetime
 *                       description: The date and time that the user was created.
 *                       example: 2025-02-25 14:47:41
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *components:
 *  schemas:
 *    user:
 *      type: object
 *      properties:
 *        nomUtilisateur:
 *          type: string
 *          description: The User's name.
 *          example: hida
 *        mdp:
 *          type: string
 *          description: The User's password.
 *          example: $2b$10$yQJvL8QFiQG8fhTEJxfe9.h42UPRWEnjaOyDXuM/YdGMVU985qici
 *        nbPropositions:
 *          type: string
 *          description: The number of propositions that the user made.
 *          example: 5
 *        createdAt:
 *          type: datetime
 *          description: The date and time that the user was created.
 *          example: 2025-02-25 14:47:41
 *      required:
 *        - nomUtilisateur
 *        - mdp
 *        - nbPropositions
 *        - createdAt
 */
UserRouter.post("/", async (req, res) => {
  try {
    // Hash the password before saving the user
    req.body.mdp = await bcrypt.hash(req.body.mdp, 10);

    // Create the user
    const createdUser = await User.create(req.body);

    // Define the message for the API consumer

    const token = jwt.sign({ userId: createdUser.idUtilisateur }, privateKey, {
      expiresIn: "1y",
    });
    const message = `L'utilisateur ${createdUser.nomUtilisateur} a bien été créé !`;

    //return res.json({ message, data: createdUser, token });

    return res.json({ message, data: createdUser, token });
  } catch (error) {
    // Handle validation errors
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, data: error });
    }

    // General error response
    const message =
      "L'utilisateur n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    res.status(500).json({ message, data: error });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     summary: destroy a User by ID.
 *     description: destroy a single User by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the User to destroy.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single User.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     idUtilisateur:
 *                       type: integer
 *                       description: The User's ID.
 *                       example: 1
 *                     nomUtilisateur:
 *                       type: string
 *                       description: The User's name.
 *                       example: hida
 *                     mdp:
 *                       type: string
 *                       description: The User's password.
 *                       example: $2b$10$yQJvL8QFiQG8fhTEJxfe9.h42UPRWEnjaOyDXuM/YdGMVU985qici
 *                     nbPropositions:
 *                       type: string
 *                       description: The number of propositions that the user made.
 *                       example: 5
 *                     createdAt:
 *                       type: datetime
 *                       description: The date and time that the user was created.
 *                       example: 2025-02-25 14:47:41
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
UserRouter.delete("/:id", auth, (req, res) => {
  User.findByPk(req.params.id)
    .then((deletedUser) => {
      if (deletedUser === null) {
        const message =
          "Le utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        // A noter ici le return pour interrompre l'exécution du code
        return res.status(404).json({ message });
      }
      return User.destroy({
        where: { idUtilisateur: deletedUser.idUtilisateur },
      }).then((_) => {
        // Définir un message pour le consommateur de l'API REST
        const message = `Le utilisateur ${deletedUser.nomUtilisateur} a bien été supprimé !`;
        // Retourner la réponse HTTP en json avec le msg et le utilisateur créé
        res.json(success(message, deletedUser));
      });
    })
    .catch((error) => {
      const message =
        "Le utilisateur n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     summary: update an user.
 *     description: update an user using thier id. Can be used to populate a select HTML tag.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the User to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: A single User.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     idUtilisateur:
 *                       type: integer
 *                       description: The User's ID.
 *                       example: 1
 *                     nomUtilisateur:
 *                       type: string
 *                       description: The User's name.
 *                       example: hida
 *                     mdp:
 *                       type: string
 *                       description: The User's password.
 *                       example: $2b$10$yQJvL8QFiQG8fhTEJxfe9.h42UPRWEnjaOyDXuM/YdGMVU985qici
 *                     nbPropositions:
 *                       type: string
 *                       description: The number of propositions that the user made.
 *                       example: 5
 *                     createdAt:
 *                       type: datetime
 *                       description: The date and time that the user was created.
 *                       example: 2025-02-25 14:47:41
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 *components:
 *  schemas:
 *    user:
 *      type: object
 *      properties:
 *        nomUtilisateur:
 *          type: string
 *          description: The User's name.
 *          example: hida
 *        mdp:
 *          type: string
 *          description: The User's password.
 *          example: $2b$10$yQJvL8QFiQG8fhTEJxfe9.h42UPRWEnjaOyDXuM/YdGMVU985qici
 *        nbPropositions:
 *          type: string
 *          description: The number of propositions that the user made.
 *          example: 5
 *        createdAt:
 *          type: datetime
 *          description: The date and time that the user was created.
 *          example: 2025-02-25 14:47:41
 *      required:
 *        - nomUtilisateur
 *        - mdp
 *        - nbPropositions
 *        - createdAt
 */
UserRouter.put("/:id", auth, (req, res) => {
  const idUtilisateur = req.params.id;
  User.update(req.body, { where: { idUtilisateur: idUtilisateur } })
    .then((_) => {
      return User.findByPk(idUtilisateur).then((updatedUser) => {
        if (updatedUser === null) {
          const message =
            "Le utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          // A noter ici le return pour interrompre l'exécution du code
          return res.status(404).json({ message });
        }
        // Définir un message pour l'utilisateur de l'API REST
        const message = `Le utilisateur ${updatedUser.nomUtilisateur} dont l'id vaut ${updatedUser.idUser} a été mis à jour avec succès !`;
        // Retourner la réponse HTTP en json avec le msg et le utilisateur créé
        res.json(success(message, updatedUser));
      });
    })
    .catch((error) => {
      const message =
        "Le utilisateur n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});



export { UserRouter };
