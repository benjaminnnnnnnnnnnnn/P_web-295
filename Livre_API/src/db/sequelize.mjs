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

// Le modèle product
const User = UtilisateurModel(sequelize, DataTypes);
const Ouvrage = OuvrageModel(sequelize, DataTypes);
const Apprecier = ApprecierModel(sequelize, DataTypes);
const Categorie = CategorieModel(sequelize, DataTypes);
const Commenter = CommenterModel(sequelize, DataTypes);

// Define associations
Ouvrage.belongsTo(Categorie, { foreignKey: 'idCategorie' });
Categorie.hasMany(Ouvrage, { foreignKey: 'idCategorie' });

let initDb = () => {
    return sequelize
        .sync({ force: true }) // Use alter instead of force
        .then((_) => {
            // Create necessary categories
            return Categorie.bulkCreate([
                { idCategorie: 1, nomCategorie: 'Default Category' },
                // Add other categories if needed
            ]);
        })
        .then((_) => {
            importOuvrages();
            importUsers();
            console.log("La base de données db_ouvrages a bien été synchronisée");
        });
};

const importOuvrages = () => {
    // import tous les produits présents dans le fichier db/mock-livre.mjs
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

const importUsers = () => {
    bcrypt
        .hash("etml", 10) // temps pour hasher = du sel
        .then((hash) =>
            User.create({
                username: "etml",
                password: hash,
            })
        )
        .then((user) => console.log(user.toJSON()));
};

export { sequelize, initDb, Ouvrage, User };
