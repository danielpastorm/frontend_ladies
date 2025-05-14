import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { AuthService, LoginDTO, LoginResponse, Register, UserProfile } from './services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RegisterResponse } from './services/auth/auth.service';
import { Dialog } from 'primeng/dialog';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { Fluid, FluidModule } from 'primeng/fluid';
import { MenuModule } from 'primeng/menu';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
    selector: 'app-root',
    imports: [Toast, ButtonModule, RouterOutlet, CommonModule, Dialog, DatePickerModule, FluidModule,
        TableModule, MenuModule,
        RouterModule,
        MenubarModule,
        InputTextModule,
        FormsModule,
        IftaLabelModule,
        FloatLabel,
        PasswordModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [
        MessageService
    ]
})

export class AppComponent {

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
    userName: string = '';
    value: string | undefined;
    items: MenuItem[] | undefined;
    endItems: MenuItem[] | undefined;

    title = 'Ladies First';
    role: string = "";

    token_test: string = "";

    isAdmin: boolean = false;

    loginModel: LoginDTO = {
        email: '',
        password: ''
    };




    constructor(private messageService: MessageService, private authService: AuthService, private router: Router) {

        // Opcional: Al iniciar, verifica si ya hay un token en localStorage.
        const token = localStorage.getItem('token');
        this.token_test = localStorage.getItem('token') ?? '';
        if (token) {
            this.isAuthenticated = true;
            // Podrías decodificar el token o almacenar el nombre de usuario previamente.
            this.userName = localStorage.getItem('userName') || '';
        }
    }


    showLoginModal() {
        this.displayLogin = true;
    }

    showRegisterModal() {
        this.displayRegister = true;

    }
    toggleDarkMode() {
        const element = document.querySelector('html');
        element?.classList.toggle('dark-mode');
    }





    login() {
        this.isLoggingOut = true;
        this.authService.login(this.loginModel).subscribe(
            (response: LoginResponse) => {

                this.messageService.add({
                    severity: 'success',
                    summary: 'Inicio de sesión exitoso!',
                    detail: 'Has iniciado Sesión correctamente. redirigiendo a tu perfil'
                });

                // Guarda el token y el nombre de usuario
                localStorage.setItem('token', response.token);

                this.isAuthenticated = true;
                // Limpia el formulario
                this.loginModel = { email: '', password: '' };

                // Simula un retardo para mostrar el estado de "Cerrando sesión"
                setTimeout(() => {
                    this.isLoggingOut = false;
                    // Puedes recargar la página o redirigir al login
                    this.isAuthenticated = true;
                    // O usando el router: this.router.navigate(['/login']);
                }, 1000);


            },
            error => {
                this.isLoggingOut = false;

                console.error('Error al iniciar sesión', error);

                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error al iniciar sesión!',
                    detail: 'Intenta nuevamente'
                });
                // Aquí podrías mostrar un mensaje de error al usuario
            }
        );
    }

    logout() {
        this.messageService.add({
            severity: 'success',
            summary: '¡Sesión cerrada!',
            detail: 'Tu sesión se ha cerrado correctamente. ¡Gracias por visitarnos, te esperamos pronto!'
        });

        this.isLoggingOut = true;
        this.authService.logout();
        this.isLoggingOut = false;
        this.router.navigate(["/"]);
    }

    showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
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


    ngOnInit() {

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

        this.authService.isAuthenticated$.subscribe(isAuth => {
            this.isAuthenticated = isAuth;
            this.buildMenu();
        });

        this.authService.role$.subscribe(role => {
            this.isAdmin = role?.toLowerCase() === 'admin';
            this.buildMenu(); // 🔄 reconstruye menú si cambia rol
        });


    }

    buildMenu() {
        this.items = [
            // {
            //     icon: 'pi pi-moon', command: () => this.toggleDarkMode()
            // },
            { label: 'Inicio', icon: 'pi pi-home', routerLink: ['/'] },
            { label: 'Productos', icon: 'pi pi-heart-fill', routerLink: ['/comprar-productos'] },
            { label: 'Kits', icon: 'pi pi-shopping-bag', routerLink: ['/Kits'] }
        ];

        if (this.isAuthenticated) {
            this.items.push({
                label: 'Perfil',
                icon: 'pi pi-user',
                items: [
                    { label: 'Mi Perfil', icon: 'pi pi-user', routerLink: ['/miperfil'] },
                    { label: 'Mis compras', icon: 'pi pi-shopping-cart', routerLink: ['/compras'] },
                    { label: 'Administrar suscripción', icon: 'pi pi-cog', routerLink: ['/suscripcion'] }
                ]
            });
            this.items.push(
                { label: "Carrito", icon: "pi pi-shopping-cart", routerLink: ['/carrito'] }
            );
        } else {
            this.endItems = [
                { label: 'Iniciar Sesión / Registrarse', icon: 'pi pi-user', routerLink: ['/miperfil'] }
            ];
        }

        if (this.isAdmin) {
            this.items.push({
                label: 'Panel de admin',
                icon: 'pi pi-lock',
                items: [
                    {
                        label: 'Productos',
                        icon: 'pi pi-box',
                        items: [
                            { label: 'Editar', icon: 'pi pi-pencil', routerLink: ['/editarproductos'] },
                            { label: 'Crear', icon: 'pi pi-plus', routerLink: ['/crearProducto'] }
                        ]
                    },
                    {
                        label: 'Kits',
                        icon: 'pi pi-th-large',
                        items: [
                            { label: 'Editar', icon: 'pi pi-pencil', routerLink: ['/editarKits'] },
                            { label: 'Crear', icon: 'pi pi-plus', routerLink: ['/crearKit'] }
                        ]
                    },
                    {
                        label: 'Pedidos',
                        icon: 'pi pi-shopping-cart',
                        routerLink: ['GestionDePedidos']
                    }
                ]
            });
        }
    }



}
