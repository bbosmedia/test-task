'use client';
import { deleteAction } from '@/lib/actions/action';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { formatDate } from '@/lib/helpers/format-date';
import { toast } from 'sonner';

const ActionCard = ({
	item,
}: {
	item: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
		real: string;
		modified: string;
		userId: string | null;
	};
}) => {
	const path = usePathname();
	const handleDelete = async (id: string) => {
		const res = await deleteAction({ id, path });

		if (res.error) {
			toast.error(res.message);
		} else {
			toast.success(res.message);
		}
	};
	return (
		<Card>
			<CardContent className='flex flex-col gap-6 p-6'>
				<div className='flex flex-col gap-2'>
					<span className='font-medium'>Оригинал</span>
					<p className='text-sm text-black/50'>{item.real}</p>
				</div>
				<div className='flex flex-col gap-2'>
					<span className='font-medium'>Сжатый</span>
					<p className='text-sm text-black/50'>{item.modified}</p>
				</div>
				<div className='flex flex-col gap-2'>
					<span className='font-medium'>Дата создания</span>
					<p className='text-sm text-black/50'>{formatDate(item.createdAt)}</p>
				</div>
				<Button
					type='button'
					className='w-max'
					onClick={() => handleDelete(item.id)}
					variant='destructive'
				>
					Delete
				</Button>
			</CardContent>
		</Card>
	);
};

export default ActionCard;
