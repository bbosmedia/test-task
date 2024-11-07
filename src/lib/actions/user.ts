'use server';

import { CreateUser } from '@/types';
import { db } from '../db';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { verifyToken } from '../auth';

// Create User
export const createUser = async ({ login, password }: CreateUser) => {
	try {
		const user = await db.user.findFirst({
			where: {
				login,
			},
		});

		if (user) {
			return {
				error: true,
				message: 'Логин уже используется.',
			};
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		await db.user.create({
			data: {
				login,
				password: hashedPassword,
			},
		});

		return {
			error: false,
			message: 'Пользователь успешно создан',
			success: true,
		};
	} catch (e: any) {
		console.log(e);
		return {
			error: true,
			message: e.message,
		};
	}
};

// Check the user
export const checkUser = async () => {
	try {
		const cookieStore = await cookies();
		const valCookie = cookieStore.get('jwtTest');
		if (!valCookie) {
			return {
				error: true,
				message: 'User not authorized',
				success: false,
			};
		}

		const userCookie = verifyToken(valCookie.value);

		if (!userCookie || !userCookie.id) {
			return {
				error: true,
				message: 'User not authorized',
				success: false,
			};
		}

		const user = await db.user.findUnique({
			where: {
				id: userCookie.id,
			},
		});

		if (!user) {
			return {
				error: true,
				message: 'User not authorized',
				success: false,
			};
		}

		return {
			error: false,
			user,
		};
	} catch (error: any) {
		return {
			error: true,
			message: error.message,
		};
	}
};
