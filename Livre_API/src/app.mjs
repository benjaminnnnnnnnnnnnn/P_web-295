import express from "express";
import swaggerUi from "swagger-ui-express";
const app = express();
app.use(express.json());
const port = 3000;

import { swaggerSpec } from "./swagger.mjs";
// Route pour accéder à la documentation Swagger
//const specs = swaggerJsdoc(options);
app.use(
"/api-docs",
swaggerUi.serve,
swaggerUi.setup(swaggerSpec, { explorer: true })
);
// connect to db
import { sequelize, initDb } from "./db/sequelize.mjs";
sequelize
	.authenticate()
	.then((_) =>
		console.log("La connexion à la base de données a bien été établie")
	)
	.catch((error) => console.error("Impossible de se connecter à la DB"));

initDb();

app.get("/", (req, res) => {
	res.send("API REST of self service machine !");
});

app.get("/api/", (req, res) => {
	res.redirect(`http://localhost:${port}/`);
});

import { OuvragesRouter } from "./routes/Livres.mjs";
app.use("/api/livres", OuvragesRouter);

import { UserRouter } from "./routes/Utilisateurs.mjs";
app.use("/api/users", UserRouter);

import { CategoriesRouter } from "./routes/Categories.mjs";
app.use("/api/categories", CategoriesRouter);

import { AppreciationRouter } from "./routes/Appreciation.mjs";
app.use("/api/appreciation", AppreciationRouter);


import { loginRouter } from "./routes/login.mjs";
app.use("/api/login", loginRouter);

import { AuteursRouter } from "./routes/Auteur.mjs";
app.use("/api/auteurs", AuteursRouter);

// Si aucune route ne correspondant à l'URL demandée par le consommateur
app.use(({ res }) => {
	const message =
		"Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
	res.status(404).json(message);
});

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`);
});
