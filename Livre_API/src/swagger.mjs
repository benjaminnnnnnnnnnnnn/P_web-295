// src/swagger.mjs
import swaggerJSDoc from "swagger-jsdoc";
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
