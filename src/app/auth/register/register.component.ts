import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { IUser } from '../../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  user: IUser;
  registerForm: FormGroup;
  constructor(private authSvc: AuthService, private router: Router) { this.createForm(); }

  ngOnInit(): void {
  }

  createForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });
  }

  createUser() {
    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    this.getUserData();
    this.authSvc.createUser(this.user).then(() => {
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

  getUserData() {
    this.user = {
      ...this.registerForm.value
    };
  }
}
