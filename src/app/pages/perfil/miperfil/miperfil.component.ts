import { Component } from '@angular/core';
import { AuthService, LoginDTO, LoginResponse, UserProfile, Register, RegisterResponse } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ButtonLabel, ButtonModule } from 'primeng/button';
import { FechaPeriodo } from '../../../Data/perfil.types';
import { CalendarIcon } from 'primeng/icons';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, retry } from 'rxjs';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { NuestrosProductosComponent } from '../../productos/nuestros-productos/nuestros-productos.component';
import { PerfilServiceService } from '../../../services/perfil-service.service';
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
    CardModule, SelectModule, DatePicker,

  ],
  templateUrl: './miperfil.component.html',
  styleUrl: './miperfil.component.css'
})



export class MiperfilComponent {

  visible: boolean = false;
  diasDelMes = Array.from({ length: 31 }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1
  }));

  calendarioCompleto: Date[] = [];
  hoy: Date = new Date();

  diasFertiles: Date[] = [];
  diasInactivos: Date[] = [];
  diasDePeriodo: Date[] = [];
  fechaOvulacion!: Date;



  regular: boolean | null = null;
  ultCiclo: Date | null = null;
  confirmado: boolean | null = null;
  diaAprox: number | null = null;

  ciclo: FechaPeriodo = {
    IdUsuario: '',
    esRegular: false,
    ultimoCiclo: new Date,
    Confirmado: false,
    diaAproximado: 0
  };

  cicloOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false }
  ];

  confirmacionOptions = [
    { label: 'Sí, es correcto', value: true },
    { label: 'No, está mal', value: false }
  ];

  calcularProximoPeriodo(fecha: Date): Date {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + 28);
    return nueva;
  }


  guardarCiclo() {
    this.ciclo.Confirmado = this.confirmado ?? false;
    this.ciclo.IdUsuario = localStorage.getItem("Id") ?? "";
    this.ciclo.diaAproximado = this.diaAprox ?? 0;
    this.ciclo.esRegular = this.regular ?? false;
    this.ciclo.ultimoCiclo = this.ultCiclo ?? new Date;


    // Validaciones básicas
    if (this.regular === true && (!this.ultCiclo || this.confirmado === null)) {
      alert('Completa todos los campos para ciclos regulares.');
      return;
    }

    if (this.regular === false && !this.diaAprox) {
      alert('Ingresa el día aproximado en que te baja.');
      return;
    }

    this.perfilService.RegistrarPeriodo(this.ciclo).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Registro exitoso!',
          detail: 'Haz registrado correctamente tu información'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'warn',
          summary: '¡Ocurrio un error!',
          detail: 'Intentalo nuevamente'
        });
      }
    });


    this.visible = false;
  }


  showDialog() {
    this.visible = true;
  }
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
  clasesDias: { [key: string]: string } = {};




  constructor(private authService: AuthService, private messageService: MessageService, private perfilService: PerfilServiceService) {

    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.cargarPerfil();
      } else {
        // 🔥 Limpiar el perfil al cerrar sesión
        this.profile = {} as UserProfile;
        this.errorMessage = 'No estás autenticado';
        this.autenticated = false;
        this.loading = false;
      }
    })

  }

  ngOnInit(): void {

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);

    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      this.calendarioCompleto.push(new Date(d));
    }








    this.cargarPerfil();



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

  getClaseDia(dia: Date): string {
    console.log(dia)
    return ''
    let fechaOvulacion: Date | null = null;


    //console.log("dia del calendario: ", dia)

    let diasFert = [1, 2, 3]
    let day = dia.getDay();

    // if (this.diaAprox && this.ultCiclo) {
    //   const cicloDate = new Date(this.ultCiclo); // 👈 conversión explícita
    //   fechaOvulacion = new Date(cicloDate);
    //   fechaOvulacion.setDate(cicloDate.getDate() + this.diaAprox);
    // }
    //console.log("dia: ", day)
    //console.log(diasFert.some(d => d == day))

    if (diasFert.some(d => d == day)) return 'period'

    // if (fechaOvulacion && this.diaIgual(dia, fechaOvulacion)) return 'ovulacion';
    // if (this.diasFertiles?.some(d => this.diaIgual(d, dia))) return 'fertile';
    // if (this.diasDePeriodo?.some(d => this.diaIgual(d, dia))) return 'periodo';
    // if (this.diaIgual(dia, new Date())) return 'hoy';

    return '';
  }

  generarClasesDias() {
    this.clasesDias = {};
    for (const dia of this.calendarioCompleto) {
      const key = dia.toDateString();
      this.clasesDias[key] = this.calcularClaseDia(dia);
    }
  }
  
  calcularClaseDia(dia: Date): string {
    let fechaOvulacion: Date | null = null;
  
    // if (this.diaAprox && this.ultCiclo) {
    //   const cicloDate = new Date(this.ultCiclo);
    //   fechaOvulacion = new Date(cicloDate);
    //   fechaOvulacion.setDate(cicloDate.getDate() + this.diaAprox);
    // }

    const diaUtCiclo = this.diaAprox ?? 0
    if(this.diaAprox == dia.getDate() ) return 'ovulacion'
    console.log("dia ult ciclo: ", this.diaAprox)
    console.log("dia actual: ", dia.getDate())
    let dias_ = [1,2,3]
  
    if (fechaOvulacion && this.diaIgual(dia, fechaOvulacion)) return 'ovulacion';
    if (dias_.some(d => d == dia.getDate())) return 'fertile';
    if (this.diasDePeriodo?.some(d => this.diaIgual(d, dia))) return 'periodo';
    if (this.diaIgual(dia, new Date())) return 'hoy';
  
    return '';
  }

  diaIgual(a: Date | null | undefined, b: Date | null | undefined): boolean {
    if (!a || !b) return false;

    return a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();
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
        this.authService.setToken(response.token); // 💥 ahora notifica a toda la app
        this.isAuthenticated = true;
        this.loginModel = { email: '', password: '' };

        this.authService.getProfile().subscribe({
          next: (profile: UserProfile) => {
            localStorage.setItem("nombre", profile.nombre);
            localStorage.setItem("Id", profile.id);
            this.profile = profile;

            this.messageService.add({
              severity: 'success',
              summary: 'Inicio de sesión exitoso!',
              detail: '¡Bienvenido ' + profile.nombre + '!'
            });

            this.displayLogin = false;
            this.isLoggingOut = false;
          },
          error: err => {
            console.error('Error al obtener el perfil después del login', err);
            this.isLoggingOut = false;
          }
        });
      },
      error => {
        console.error('Error al iniciar sesión', error);
        this.isLoggingOut = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Error al iniciar sesión!',
          detail: 'Intenta nuevamente'
        });
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


  cargarPerfil() {
    this.loading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No estás autenticado';
      this.autenticated = false;
      this.loading = false;
      return;
    }

    this.authService.getProfile().subscribe({
      next: data => {
        localStorage.setItem("nombre", data.nombre)
        localStorage.setItem("Id", data.id)
        this.profile = data;
        this.errorMessage = ''; // ✅ Limpia error si todo va bien
        this.autenticated = true;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar el perfil:', err);
        this.errorMessage = 'Error al cargar el perfil';
        this.autenticated = false;
        this.loading = false;
      }
    });

    this.perfilService.ObtenerPeriodo(localStorage.getItem("Id") ?? '').subscribe({
      next: data => {
        console.log("data",data)
        this.regular = data.esRegular;
        this.ultCiclo = data.ultimoCiclo;
        this.confirmado = data.Confirmado;
        this.diaAprox = data.diaAproximado;
        this.generarClasesDias();

      }
    })
  }



}
