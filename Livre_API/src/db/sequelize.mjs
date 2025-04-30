import { Sequelize, DataTypes } from "sequelize";
import { OuvrageModel } from "../models/livre.mjs";
import { UtilisateurModel } from "../models/t_users.mjs";
import { ApprecierModel } from "../models/t_apprecier.mjs";
import { CategorieModel } from "../models/t_categorie.mjs";
import { CommenterModel } from "../models/t_commenter.mjs";
import { AuteurModel } from "../models/t_auteur.mjs";
import { EditeurModel } from "../models/t_editeur.mjs";
import * as bcrypt from "bcrypt";

const sequelize = new Sequelize("db_ouvrages", "root", "root", {
  host: "localhost",
  port: "6033",
  dialect: "mysql",
  logging: false,
});

import { livres } from "./mock-livre.mjs";

const User = UtilisateurModel(sequelize, DataTypes);
const Ouvrage = OuvrageModel(sequelize, DataTypes);
const Apprecier = ApprecierModel(sequelize, DataTypes);
const Categorie = CategorieModel(sequelize, DataTypes);
const Commenter = CommenterModel(sequelize, DataTypes);
const Auteur = AuteurModel(sequelize, DataTypes);
const Editeur = EditeurModel(sequelize, DataTypes);

//asociation
Ouvrage.belongsTo(Categorie, { foreignKey: "idCategorie" });
Categorie.hasMany(Ouvrage, { foreignKey: "idCategorie" });

Ouvrage.belongsTo(Editeur, { foreignKey: "idEditeur" });
Editeur.hasMany(Ouvrage, { foreignKey: "idEditeur" });

// Association between Ouvrage and Commenter
Ouvrage.hasMany(Commenter, { foreignKey: "idOuvrage" });

// Association between User and Commenter
User.hasMany(Commenter, { foreignKey: "idUtilisateur" });
Commenter.belongsTo(User, { foreignKey: "idUtilisateur", as: "utilisateur" });

Ouvrage.belongsTo(Auteur, { foreignKey: "idAuteur" });
Auteur.hasMany(Ouvrage, { foreignKey: "idAuteur" });
Apprecier.belongsTo(User, { foreignKey: "idUtilisateur", as: "utilisateur" });

let initDb = () => {
  return sequelize.sync({ force: true }).then((_) => {
    // First import core data
    return (
      importCategorie()
        .then(() => importEditeur())
        .then(() => importAuteur())
        .then(() => importOuvrages())
        .then(() => importUsers())
        // Then import relational data that depends on users and books
        .then(() => importAppercier())
        .then(() => importCommenter())
        .then(() => {
          console.log("La base de données db_ouvrages a bien été synchronisée");
        })
    );
  });
};

// Update your import functions to return promises
const importOuvrages = () => {
  const promises = livres.map((livre) => {
    return Ouvrage.create({
      titre: livre.titre,
      nbPages: livre.nbPages,
      extrait: livre.extrait,
      resume: livre.resume,
      anneeEdition: livre.anneeEdition,
      moyenneAppreciation: livre.moyenneAppreciation,
      imageCouverture: livre.imageCouverture,
      idCategorie: livre.idCategorie,
      idAuteur: livre.idAuteur,
      idEditeur: livre.idEditeur,
    }).then((livre) => console.log(livre.toJSON()));
  });

  return Promise.all(promises);
};

const importAppercier = () => {
  return Apprecier.create({
    idOuvrage: 1,
    idUtilisateur: 1,
    appreciation: 5,
  }).then((apprecier) => console.log(apprecier.toJSON()));
};

const importCategorie = () => {
  return Categorie.bulkCreate([
    { idCategorie: 1, nomCategorie: "Fantasy" },
    { idCategorie: 2, nomCategorie: "Jeunesse" },
    { idCategorie: 3, nomCategorie: "Philosophique" },
    { idCategorie: 4, nomCategorie: "Roman Existentialiste" },
  ]).then((categorie) => console.log(categorie));
};

const importCommenter = () => {
  return Commenter.create({
    idOuvrage: 1,
    idUtilisateur: 1,
    commentaire: "Tres bon livre",
  }).then((commentaire) => console.log(commentaire.toJSON()));
};

const importUsers = async () => {
  try {
    const users = [
      { nomUtilisateur: "admin", mdp: "admin" },
      { nomUtilisateur: "bouba", mdp: "bouba" },
    ];

    for (const user of users) {
      const hash = await bcrypt.hash(user.mdp, 10);
      const newUser = await User.create({
        nomUtilisateur: user.nomUtilisateur,
        mdp: hash,
        nbPropositions: 0,
        createdAt: new Date(),
      });
      console.log(newUser.toJSON());
    }
  } catch (error) {
    console.error("Erreur lors de l'importation des utilisateurs:", error);
  }
};

const importAuteur = () => {
  return Auteur.bulkCreate([
    { idAuteur: 1, nomAuteur: "Tolkien", prenomAuteur: "J.R.R." },
    { idAuteur: 2, nomAuteur: "Orwell", prenomAuteur: "George" },
    { idAuteur: 3, nomAuteur: "Rowling", prenomAuteur: "J.K." },
    { idAuteur: 4, nomAuteur: "de Saint-Exupéry", prenomAuteur: "Antoine" },
    { idAuteur: 5, nomAuteur: "Camus", prenomAuteur: "Albert" },
    { idAuteur: 6, nomAuteur: "Rushdie", prenomAuteur: "Salman" },
    { idAuteur: 7, nomAuteur: "Proust", prenomAuteur: "Marcel" },
    { idAuteur: 8, nomAuteur: "Dostoïevski", prenomAuteur: "Fiodor" },
    { idAuteur: 9, nomAuteur: "Flaubert", prenomAuteur: "Gustave" },
    { idAuteur: 10, nomAuteur: "Bradbury", prenomAuteur: "Ray" },
    { idAuteur: 11, nomAuteur: "Hugo", prenomAuteur: "Victor" },
    { idAuteur: 12, nomAuteur: "Homère", prenomAuteur: "" },
    { idAuteur: 13, nomAuteur: "Eco", prenomAuteur: "Umberto" },
    { idAuteur: 14, nomAuteur: "Huxley", prenomAuteur: "Aldous" },
    { idAuteur: 15, nomAuteur: "Dumas", prenomAuteur: "Alexandre" },
  ]).then((auteur) => console.log(auteur));
};

const importEditeur = () => {
  return Editeur.bulkCreate([
    { idEditeur: 1, nomEditeur: "Allen & Unwin", prenomEditeur: "" },
    { idEditeur: 2, nomEditeur: "Secker & Warburg", prenomEditeur: "" },
    { idEditeur: 3, nomEditeur: "Bloomsbury", prenomEditeur: "" },
    { idEditeur: 4, nomEditeur: "Reynal & Hitchcock", prenomEditeur: "" },
    { idEditeur: 5, nomEditeur: "Gallimard", prenomEditeur: "" },
    { idEditeur: 6, nomEditeur: "Jonathan Cape", prenomEditeur: "" },
    { idEditeur: 7, nomEditeur: "Grasset", prenomEditeur: "" },
    { idEditeur: 8, nomEditeur: "The Russian Messenger", prenomEditeur: "" },
    { idEditeur: 9, nomEditeur: "Michel Lévy", prenomEditeur: "" },
    { idEditeur: 10, nomEditeur: "Ballantine Books", prenomEditeur: "" },
    { idEditeur: 11, nomEditeur: "Pagnerre", prenomEditeur: "" },
    { idEditeur: 12, nomEditeur: "Antiquité orale", prenomEditeur: "" },
    { idEditeur: 13, nomEditeur: "Bompiani", prenomEditeur: "" },
    { idEditeur: 14, nomEditeur: "Chatto & Windus", prenomEditeur: "" },
    { idEditeur: 15, nomEditeur: "Pétion", prenomEditeur: "" },
  ]).then((editeur) => console.log(editeur));
};

export {
  sequelize,
  initDb,
  Ouvrage,
  User,
  Categorie,
  Apprecier,
  Commenter,
  Auteur,
  Editeur,
};
