import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { IUser } from '../../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import * as ui from './../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {
  user: IUser;
  registerForm: FormGroup;
  loading = false;
  uiSubscription: Subscription;
  constructor(private authSvc: AuthService,
              private store: Store<AppState>,
              private router: Router) { this.createForm(); }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(uiLoading => {
      this.loading = uiLoading.isLoading;
      console.log('Registrando...');
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  createForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });
  }

  createUser() {
    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    this.getUserData();
    this.authSvc.createUser(this.user).then(() => {
      // Swal.close();
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['']);

    }).catch(error => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    });
  }

  getUserData() {
    this.user = {
      ...this.registerForm.value
    };
  }
}
