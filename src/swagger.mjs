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
				Products: {
					type: "object",
					required: ["name", "price", "created"],
					properties: {
						id: {
							type: "integer",
							description: "L'identifiant unique du produit.",
						},
						name: {
							type: "string",
							description: "Le nom du produit.",
						},
						price: {
							type: "float",
							description: "Le prix du produit.",
						},
						created: {
							type: "string",
							format: "date-time",
							description: "La date et l'heure de l'ajout d'un produit.",
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
