import { Component, OnInit } from '@angular/core';
import { IAuth } from '../../models/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  auth: IAuth;
  loginForm: FormGroup;
  constructor(private authSvc: AuthService, private router: Router) { this.createForm(); }

  ngOnInit(): void {
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required]))
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
    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
    this.getUser();
    this.authSvc.login(this.auth).then(h => {
      Swal.close();
      this.router.navigate(['']);
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    });
  }
}
