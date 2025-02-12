import { Sequelize, DataTypes } from "sequelize";
import { OuvrageModel } from "../models/livre.mjs";
import { UtilisateurModel } from "../models/t_users.mjs";
import { ApprecierModel } from "../models/t_apprecier.mjs";
import { CategorieModel } from "../models/t_categorie.mjs";
import { CommenterModel } from "../models/t_commenter.mjs";
import * as bcrypt from "bcrypt";

const sequelize = new Sequelize(
    "db_ouvrages", // Nom de la DB qui doit exister
    "root", // Nom de l'utilisateur
    "root", // Mot de passe de l'utilisateur
    {
        host: "localhost",
        port: "6033",
        dialect: "mysql",
        logging: false,
    }
);

import { livres } from "./mock-livre.mjs";


const User = UtilisateurModel(sequelize, DataTypes);
const Ouvrage = OuvrageModel(sequelize, DataTypes);
const Apprecier = ApprecierModel(sequelize, DataTypes);
const Categorie = CategorieModel(sequelize, DataTypes);
const Commenter = CommenterModel(sequelize, DataTypes);

//asociation
Ouvrage.belongsTo(Categorie, { foreignKey: 'idCategorie' });
Categorie.hasMany(Ouvrage, { foreignKey: 'idCategorie' });

let initDb = () => {
    return sequelize
        .sync({ force: true })
        .then((_) => {

            return Categorie.bulkCreate([
                { idCategorie: 1, nomCategorie: 'Default Category' },
            ]);
        })
        .then((_) => {
            importOuvrages();
            importUsers();
            importAppercier();
            importCommenter();
            console.log("La base de données db_ouvrages a bien été synchronisée");
        });
};

const importOuvrages = () => {

    livres.map((livre) => {
        Ouvrage.create({
            titre: livre.titre,
            nbPages: livre.nbPages,
            extrait: livre.extrait,
            resume: livre.resume,
            nomAuteur: livre.nomAuteur,
            prenomAuteur: livre.prenomAuteur,
            nomEditeur: livre.nomEditeur,
            anneeEdition: livre.anneeEdition,
            moyenneAppreciation: livre.moyenneAppreciation,
            imageCouverture: livre.imageCouverture,
            idCategorie: livre.idCategorie,
        }).then((livre) => console.log(livre.toJSON()));
    });
};

const importAppercier = () => {

        Apprecier.create({
            idOuvrage: 1,
            idUtilisateur: 1,
            appreciation: 5,
        }).then((apprecier) => console.log(apprecier.toJSON()));
};

const importCommenter = () => {

    Commenter.create({
        idOuvrage: 1,
        idUtilisateur: 1,
        commentaire: "Tres bon livre",
    }).then((commentaire) => console.log(commentaire.toJSON()));
};

const importUsers = () => {
    bcrypt
        .hash("admin", 10)
        .then((hash) =>
            User.create({
                nomUtilisateur: "admin",
                mdp: hash,
                nbPropositions: 0,
                createdAt: new Date(),
            })
        )
        .then((user) => console.log(user.toJSON()));
};

export { sequelize, initDb, Ouvrage, User };
