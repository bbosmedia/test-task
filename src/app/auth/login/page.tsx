'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createUser } from '@/lib/actions/user';

const LoginPage = () => {
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const formSchema = z.object({
		login: z.string().min(4, {
			message: 'Логин должен содержать не менее 4 символов.',
		}),
		password: z.string().min(4, {
			message: 'Пароль должен содержать не менее 4 символов.',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			login: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const res = await axios.post('/api/auth/login', {
			...values,
		});

		if (res.status === 201) {
			toast.success(res.data.message);
			router.push('/');
		} else {
			const data = await res.data;
			toast.error(data.message || 'Something went wrong');
			setErrorMessage(data.message);
		}
		setIsLoading(false);
	}
	return (
		<div className='flex items-center justify-center p-6 min-h-screen w-full'>
			<Card className='max-w-[500px] w-full'>
				<CardHeader>Войти</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col gap-4'
						>
							<FormField
								disabled={isLoading}
								control={form.control}
								name='login'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Логин</FormLabel>
										<FormControl>
											<Input
												placeholder='Логин'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='password'
								disabled={isLoading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Пароль</FormLabel>
										<FormControl>
											<Input
												placeholder='Пароль'
												type='password'
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
								Войти
							</Button>
							{errorMessage && <p className='text-red-500'>{errorMessage}</p>}
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
