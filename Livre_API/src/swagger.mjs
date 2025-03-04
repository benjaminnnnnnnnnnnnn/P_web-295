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
