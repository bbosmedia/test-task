import { verifyToken } from '@/lib/auth';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export const useAuth = () => {
	const [jwt, setJwt] = useState<{
		userId: string;
		role: string;
		login: string;
	}>({
		userId: '',
		role: '',
		login: '',
	});
	const token = Cookies.get('jwtTest');

	useEffect(() => {
		if (token) {
			const a: any = verifyToken(token);
			setJwt({
				userId: a.id,
				login: a.login,
				role: a.role,
			});
		}
	}, [token]);

	return jwt;
};
