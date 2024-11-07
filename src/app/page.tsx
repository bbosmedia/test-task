import { getUserActions } from '@/lib/actions/action';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateCationForm from '@/components/forms/create-action-form';
import ActionCard from '@/components/cards/action-card';

const Home = async () => {
	const { actions, error, message } = await getUserActions();

	return (
		<div className='max-w-[900px] p-6 w-full mx-auto'>
			{error && <p>{message}</p>}
			{actions && (
				<Tabs
					defaultValue='create'
					className='w-full'
				>
					<TabsList>
						<TabsTrigger value='create'>Создавать</TabsTrigger>
						<TabsTrigger value='list'>Список</TabsTrigger>
					</TabsList>
					<TabsContent
						value='create'
						className='w-full'
					>
						<CreateCationForm />
					</TabsContent>
					<TabsContent value='list'>
						<div className='flex flex-col gap-4'>
							{actions.map(item => (
								<ActionCard
									key={item.id}
									item={item}
								/>
							))}
						</div>
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
};

export default Home;
