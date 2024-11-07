export interface CreateUser {
	login: string;
	password: string;
}

export interface CreateAction {
	real: string;
	path: string;
}

export interface DeleteAction {
	id: string;
	path: string;
}
