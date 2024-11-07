import { db } from '@/lib/db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET;

export const POST = async (req: Request) => {
	const { login, password } = await req.json();

	try {
		const user = await db.user.findUnique({
			where: { login },
		});

		if (!user) {
			return NextResponse.json(
				{ message: 'Foydalanuvhi topilmadi' },
				{ status: 404 }
			);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Parol yoki login hato kiritilgan' },
				{ status: 400 }
			);
		}

		const token = jwt.sign(
			{
				id: user.id,
				login: user.login,
			},
			SECRET_KEY as string,
			{ expiresIn: '500d' }
		);

		const res = NextResponse.json(
			{ message: 'Muvaffaqiyatli kirdingiz', token },
			{ status: 201 }
		);

		res.cookies.set('jwtTest', token, {
			maxAge: 60 * 60 * 24 * 500, // 7 days
		});
		return res;
	} catch (error) {
		return NextResponse.json(
			{ message: 'Qanaqadir hatolik serverda', error },
			{ status: 500 }
		);
	}
};
