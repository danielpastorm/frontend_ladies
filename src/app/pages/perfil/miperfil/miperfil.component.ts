import { Component } from '@angular/core';
import { AuthService, LoginDTO, LoginResponse, UserProfile, Register, RegisterResponse } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { CalendarIcon } from 'primeng/icons';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { MessageService } from 'primeng/api';

import * as jwt_decode from 'jwt-decode';
// const decoded = jwt_decode.default(token);

export interface JwtPayload {
  sub: string;
  jti: string;
  uid: string;
  exp: number;
  iss: string;
  aud: string;
  role?: string; // Si incluyes el rol en el token
}


@Component({
  selector: 'app-miperfil',
  imports: [CommonModule, Dialog, ButtonModule, InputTextModule, FormsModule, IftaLabelModule, FloatLabel, PasswordModule,
    CalendarIcon, CalendarModule
  ],
  templateUrl: './miperfil.component.html',
  styleUrl: './miperfil.component.css'
})



export class MiperfilComponent {


  loginModel: LoginDTO = {
    email: '',
    password: ''
  };

  error: boolean = false;
  registerModel!: Register;
  registerResponse!: RegisterResponse;
  profile!: UserProfile;

  loading: boolean = true;
  autenticated: boolean = false;
  errorMessage: string = '';
  isAuthenticated = false;
  isLoggingOut: boolean = false;


  registering: boolean = false;
  error_string: string = '';

  displayLogin: boolean = false;
  displayRegister = false;
  role: string = "";


  constructor(private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {







    registerModel: this.registerModel = {
      email: '',
      nombre: '',
      password: '',
      fechaNacimiento: '',
      calle: '',
      numero: '',
      colonia: '',
      codigoPostal: '',
      ciudad: '',
      estado: ''
    };


    // Opcional: Verificar si hay token almacenado
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No estás autenticado';
      this.autenticated = false;
      this.loading = false;
      return;
    }



    // Llamar al endpoint de perfil
    this.authService.getProfile().subscribe({
      next: data => {
        localStorage.setItem("nombre", data.nombre)
        localStorage.setItem("Id", data.id)
        this.profile = data;
        this.loading = false;
        this.autenticated = true;
      },
      error: err => {
        console.error('Error al cargar el perfil:', err);
        this.errorMessage = 'Error al cargar el perfil';
        this.autenticated = false;
        this.loading = false;
      }
    });

    // Llamar al endpoint de perfil
    this.authService.getRole().subscribe({
      next: (data: string) => {
        this.role = data;
        console.log(this.role)

      },
      error: err => {
        console.error('Error al cargar el perfil:', err);
        this.role = "this.error";
        console.log(this.role)

      }
    });


  }


  showLoginModal() {
    this.displayLogin = true;
  }

  showRegisterModal() {
    this.displayRegister = true;

  }


  login() {
    this.isLoggingOut = true;

    this.authService.login(this.loginModel).subscribe(
      (response: LoginResponse) => {
        // Guarda el token y el nombre de usuario
        localStorage.setItem('token', response.token);
        this.isAuthenticated = true;
        // Limpia el formulario
        this.loginModel = { email: '', password: '' };

        // Simula un retardo para mostrar el estado de "Cerrando sesión"
        setTimeout(() => {
          this.isLoggingOut = false;
          // Puedes recargar la página o redirigir al login
          window.location.reload();
          this.isAuthenticated = true;
          // O usando el router: this.router.navigate(['/login']);
        }, 1000);

      },
      error => {
        console.error('Error al iniciar sesión', error);
        this.isLoggingOut = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Error al iniciar sesión!',
          detail: 'Intenta nuevamente'
        });
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }



  register() {
    // Si la fecha es un objeto Date, lo transformamos a string
    this.registering = true;
    this.error = false;
    this.authService.register(this.registerModel).subscribe(
      (response: RegisterResponse) => {
        console.log('Registro exitoso', response);

        this.messageService.add({
          severity: 'success',
          summary: '¡Registro exitoso!',
          detail: 'Te has registrado correctamente. redirigiendo a tu perfil'
        });


        setTimeout(() => {



          // O usando el router: this.router.navigate(['/login']);
        }, 2000);

        this.loginModel = { email: '', password: '' };

        this.loginModel.email = this.registerModel.email;
        this.loginModel.password = this.registerModel.password;

        this.authService.login(this.loginModel).subscribe(
          (response: LoginResponse) => {
            // Guarda el token y el nombre de usuario
            localStorage.setItem('token', response.token);
            this.isAuthenticated = true;
            // Limpia el formulario
            this.loginModel = { email: '', password: '' };

            // Simula un retardo para mostrar el estado de "Cerrando sesión"
            setTimeout(() => {


              this.isLoggingOut = false;
              // Puedes recargar la página o redirigir al login
              window.location.reload();
              this.isAuthenticated = true;


              // O usando el router: this.router.navigate(['/login']);
            }, 1000);

          },
          error => {
            console.error('Error al iniciar sesión', error);
            // Aquí podrías mostrar un mensaje de error al usuario
          }
        );

        // Puedes asignar el perfil con la respuesta si lo deseas:
        // O redirigir,  mensaje, etc.
        this.registering = false;
      },
      error => {
        console.error('Error en el registro:', error);
        // Si el error viene como un array en error.error, extraemos la descripción
        if (error.error && Array.isArray(error.error) && error.error.length > 0) {
          this.error_string = error.error[0].description;
        } else {
          this.error_string = 'Ocurrió un error inesperado.';
        }
        this.error = true;
        this.registering = false;
      }
    );
  }



}
