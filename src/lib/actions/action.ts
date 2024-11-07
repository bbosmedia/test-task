'use server';
import { CreateAction, DeleteAction } from '@/types';
import { db } from '../db';
import { checkUser } from './user';
import { compressString } from '../helpers/compress-string';
import { revalidatePath } from 'next/cache';

export const getUserActions = async () => {
	try {
		const res = await checkUser();

		if (!res.user) {
			return {
				...res,
				actions: undefined,
			};
		}

		const user = res.user;

		const actions = await db.actions.findMany({
			where: {
				userId: user.id,
			},
		});

		return {
			error: false,
			success: true,
			actions,
		};
	} catch (error: any) {
		console.log(error);
		return {
			error: true,
			success: false,
			message: error.message,
		};
	}
};

// Create Action
export const createAction = async ({ real, path }: CreateAction) => {
	try {
		const res = await checkUser();

		if (!res.user) {
			return {
				...res,
				actions: undefined,
			};
		}

		const user = res.user;

		const modified = compressString(real);

		await db.actions.create({
			data: {
				userId: user.id,
				real,
				modified,
			},
		});

		revalidatePath(path);

		return {
			error: false,
			success: true,
			message: 'Действие создано успешно',
		};
	} catch (error: any) {
		console.log(error);
		return {
			error: true,
			success: false,
			message: error.message,
		};
	}
};

// Удалить действие
export const deleteAction = async ({ id, path }: DeleteAction) => {
	try {
		const res = await checkUser();

		if (!res.user) {
			return {
				...res,
				actions: undefined,
			};
		}

		await db.actions.delete({
			where: {
				id,
			},
		});

		revalidatePath(path);

		return {
			error: false,
			success: true,
			message: 'Действие успешно удалено',
		};
	} catch (error: any) {
		console.log(error);
		return {
			error: true,
			success: false,
			message: error.message,
		};
	}
};
