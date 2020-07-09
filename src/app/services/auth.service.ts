import { Injectable } from '@angular/core';
import { IUser, User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { IAuth } from '../models/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      console.log(fuser?.uid);
      console.log(fuser?.email);
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
