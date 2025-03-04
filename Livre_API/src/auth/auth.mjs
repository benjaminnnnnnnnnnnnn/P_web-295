import jwt from "jsonwebtoken";
import { privateKey } from "./private_key.mjs";

const auth = (req, res, next) => {
	const authorizationHeader = req.headers.authorization;
	if (!authorizationHeader) {
		const message = `You havent provided the authentification token. Add it in the request header.`;
		return res.status(401).json({ message });
	} else {
		const token = authorizationHeader.split(" ")[1];
		const decodedToken = jwt.verify(
			token,
			privateKey,
			(error, decodedToken) => {
				if (error) {
					const message = `The user is not authorised to access this ressource.`;
					return res.status(401).json({ message, data: error });
				}
				const userId = decodedToken.userId;
				if (req.body.userId && req.body.userId !== userId) {
					const message = `L'identifiant de l'utisateur est invalide`;
					return res.status(401).json({ message });
				} else {
					next();
				}
			}
		);
	}
};
export { auth };
 