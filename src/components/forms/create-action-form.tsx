'use client';
import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { usePathname } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { createAction } from '@/lib/actions/action';
import { toast } from 'sonner';

const CreateCationForm = () => {
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const path = usePathname();

	const formSchema = z.object({
		real: z
			.string()
			.min(1, { message: 'Поле обязательно для заполнения' })
			.regex(/^[ЛПВНОБ]+$/, {
				message: 'Разрешены только Л, П, В, Н, О, Б.',
			}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			real: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const { error, message } = await createAction({
				real: values.real,
				path,
			});

			if (error) {
				toast.error(message);
			} else {
				toast.success(message);
				form.reset();
			}
			setIsLoading(false);
		} catch (error: any) {
			setErrorMessage(error.message);
			setIsLoading(false);
		}
	}
	return (
		<Card className='w-full shadow-none'>
			<CardHeader className='text-left'>
				<CardTitle>Форма для создания действия</CardTitle>
				<CardDescription className='text-sm text-neutral-600'>
					Форма для создания действия. Возможные команды: <br />Л - налево{' '}
					<br />П - направо <br />В - вверх <br />Н - вниз <br />О - взять
					образец <br />Б - отпустить образец
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col gap-4'
					>
						<FormField
							disabled={isLoading}
							control={form.control}
							name='real'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Действия</FormLabel>
									<FormControl>
										<Input
											placeholder='Действия... (Л, П, В, Н, О, Б)'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={isLoading}
							type='submit'
							className='w-full mt-4'
						>
							Создавать
						</Button>
						{errorMessage && <p className='text-red-500'>{errorMessage}</p>}
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default CreateCationForm;
