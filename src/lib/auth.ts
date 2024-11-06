// utils/auth.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string;

// Verify Token
export const verifyToken = (token: string) => {
	try {
		// Replace 'your-secret' with your actual secret, or decode the token without verifying the signature
		const decoded = jwt.decode(token, { complete: true });

		if (!decoded) {
			throw new Error('Invalid token');
		}

		// Check if the token is expired
		const { exp } = decoded.payload as { exp: number };
		if (Date.now() >= exp * 1000) {
			throw new Error('Token has expired');
		}

		return decoded.payload; // Return the payload if valid
	} catch (error) {
		console.error(error);
		return null;
	}
};

// Sign Token
export function signToken(user: {
	id: string;
	username: string;
	role: string;
}) {
	try {
		const token = jwt.sign(
			{
				id: user.id,
				username: user.username,
				role: user.role, // 'owner' or 'user'
			},
			SECRET_KEY,
			{ expiresIn: '500d' }
		);
		return token;
	} catch (error) {
		console.log(error);
		return null;
	}
}
