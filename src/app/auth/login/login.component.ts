import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAuth } from '../../models/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  auth: IAuth;
  loginForm: FormGroup;
  loading = false;
  uiSubcription: Subscription;
  constructor(private authSvc: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.uiSubcription = this.store.select('ui').subscribe(uiLoading => {
      this.loading = uiLoading.isLoading;
      console.log('cargando ...');
    });
  }

  ngOnDestroy(): void {
    this.uiSubcription.unsubscribe();
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('romeromarilu13@gmail.com', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('123456', Validators.compose([Validators.required]))
    });
  }

  getUser() {
    const { email, password } = this.loginForm.value;
    this.auth = {
      email,
      password
    };
  }

  login() {
    if ( this.loginForm.invalid ) { return; }
    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });
    this.getUser();
    this.authSvc.login(this.auth).then(h => {
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
}
