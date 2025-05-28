import express from "express";
import cors from "cors"; 
import swaggerUi from "swagger-ui-express";

const app = express();

// ✨ Use CORS before routes
app.use(cors({
  origin: 'http://localhost:5173', // Vue app
  credentials: true
}));

app.use('/public', express.static('public'));


app.use(express.json());
const port = 3000;

import { swaggerSpec } from "./swagger.mjs";
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use('/uploads', express.static('uploads'))

app.use('/bookcovers', express.static('public/bookcovers'))

// connect to db
import { sequelize, initDb } from "./db/sequelize.mjs";
sequelize
  .authenticate()
  .then(() =>
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

// routes
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


// 404 handler
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json(message);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
