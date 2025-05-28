import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/sequelize.mjs";
import { privateKey } from "../auth/private_key.mjs";

const loginRouter = express();

/**
* @swagger
* /api/login/:
*   post:
*     tags: [Login]
*     summary: Login.
*     description: Login. Can be used to populate a select HTML tag.
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/user'
*     responses:
*       200:
*         description: A single User.
*       404:
*         description: User not found.
*       401:
*         description: Unauthorized (wrong password).
*       500:
*         description: Internal server error.
*components:
*  schemas:
*    user:
*      type: object
*      properties:
*        username:
*          type: string
*          description: The User's name.
*          example: admin
*        password:
*          type: string
*          description: The User's password.
*          example: admin
*      required:
*        - username
*        - password
*/
loginRouter.post("/", (req, res) => {

	User.findOne({ where: { nomUtilisateur: req.body.username } })
		.then((user) => {
			if (!user) {
				const message = `L'utilisateur demandé n'existe pas`;
				return res.status(404).json({ message });
			}
			bcrypt
				.compare(req.body.password, user.mdp)
				.then((isPasswordValid) => {
					if (!isPasswordValid) {
						const message = `Le mot de passe est incorrecte.`;
						return res.status(401).json({ message });
					} else {
						// JWT
						console.log (user.idUtilisateur);
						const token = jwt.sign({ userId: user.idUtilisateur, nomUtilisateur: user.nomUtilisateur }, privateKey, {
							expiresIn: "1y",
						});
						const message = `L'utilisateur a été connecté avec succès`;
						return res.json({ message, data: user, token });
					}
				});
		})
		.catch((error) => {
			const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants`;
			return res.json({ message, data: error });
		});
});
export { loginRouter };
