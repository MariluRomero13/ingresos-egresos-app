import { Injectable } from '@angular/core';
import { IUser, User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { IAuth } from '../models/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authAction from './../auth/auth.actions';
import { Subscription } from 'rxjs';
import { unSetItems } from '../ingredo-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubscription: Subscription;
  private _user: User;
  constructor(public auth: AngularFireAuth,
              private store: Store<AppState>,
              private firestore: AngularFirestore) { }

  get user() {
    return this._user;
  }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      if (fuser) {
        this.authSubscription = this.firestore.doc(`${fuser.uid}/usuario`)
          .valueChanges().subscribe((firebaseUser: any) => {
          const user = User.fromFirebase(firebaseUser);
          this._user = user;
          this.store.dispatch(authAction.setUser({ user }));
        });
      } else {
        this._user = null;
        this.authSubscription.unsubscribe();
        this.store.dispatch(authAction.unSetUser());
        this.store.dispatch(unSetItems()); // Remove ingreso y egreso
      }
    });
  }

  createUser(user2: IUser) {
    return this.auth.createUserWithEmailAndPassword(user2.email, user2.password).then(({ user }) => {
      const newUser = new User(user.uid, user2.username, user.email);
      return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
    });
  }

  login(user: IAuth) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(fuser =>  fuser != null)
    );
  }
}
