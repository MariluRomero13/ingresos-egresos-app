import { createAction, props } from '@ngrx/store';
import { User } from './../models/user';

export const setUser = createAction('[Auth Component] setUser', props<{ user: User }>());
export const unSetUser = createAction('[Auth Component] unSetUser');
