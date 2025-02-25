// src/swagger.mjs
import swaggerJSDoc from "swagger-jsdoc";
import { Categorie } from "./db/sequelize.mjs";
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API self-service-machine",
			version: "1.0.0",
			description:
				"API REST permettant de gérer l'application self-service-machine",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				Livres: {
					type: "object",
					required: ["titre", "nbPages", "extrait", "resume", "nomAuteur", "prenomAuteur", "nomEditeur", "anneeEdition", "moyenneAppreciation"],
					properties: {
						idOuvrage: {
							type: "integer",
							description: "L'identifiant unique du livre.",
						},
						titre: {
							type: "string",
							description: "Le nom du livre.",
						},
						nbPage: {
							type: "integer",
							description: "Nombre de pages du livre.",
						},
						extrait: {
							type: "string",
							description: "extrait du livre.",
						},
						resume: {
							type: "string",
							description: "resume du livre.",
						},
						nomAuteur: {
							type: "string",
							description: "nom de l'auteur.",
						},
						prenomAuteur: {
							type: "string",
							description: "prenom de l'auteur.",
						},
						nomEditeur: {
							type: "string",
							description: "nom de l'editeur.",
						},
						anneeEdition: {
							type: "integer",
							description: "année d'édition.",
						},
						moyenneAppreciation: {
							type: "integer",
							description: "moyenne d'appréciation.",
						},
					},
				},

				Utilisateurs: {
					type: "object",
					required: ["nomUtilisateur", "mdp", "nbPropositions", "createdAt"],
					properties: {
						idUtilisateur: {
							type: "integer",
							description: "L'identifiant unique de l'utilisateur.",
						},
						nomUtilisateur: {
							type: "string",
							description: "Le nom de l'utilisateur.",
						},
						mdp: {
							type: "string",
							description: "Le mot de passe de l'utilisateur.",
						},
						nbPropositions: {
							type: "string",
							description: "Le nombre de proposition que l'utilisateur a fait.",
						},
						createdAt: {
							type: "datetime",
							description: "La date et l'heure de création de l'utilisateur.",
						},
					},
				},

				Categories: {
					type: "object",
					required: ["nomCategorie"],
					properties: {
						idCategorie: {
							type: "integer",
							description: "L'identifiant unique de la catégorie.",
						},
						nomCategorie: {
							type: "string",
							description: "Le nom de la catégorie.",
						},
					},
				},
				// Ajoutez d'autres schémas ici si nécessaire
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./src/routes/*.mjs"], // Chemins vers vos fichiers de route
};
const swaggerSpec = swaggerJSDoc(options);
export { swaggerSpec };
