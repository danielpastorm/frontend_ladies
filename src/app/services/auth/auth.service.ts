import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { jwtDecode } from "/Users/danielpastor/Documents/LadiesFirst/frontend_ladies/node_modules/jwt-decode/build/esm/index"

export interface JwtPayload {
  exp: number; // tiempo en segundos
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
}


export interface errorResponse {
  code: string;
  description: string;
}


export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  fechaNacimiento: string;
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
}

export interface Register {
  email: string;
  password: string;
  nombre: string;
  fechaNacimiento: string;
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
}
export interface RegisterResponse {
  code: string;
  description: string;
  message: string;
}





@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  public role$ = this.roleSubject.asObservable();

  private authSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  public isAuthenticated$ = this.authSubject.asObservable();

  public public_role: string = "";
  apiUrl: string = environment.apiUrl + "Auth";

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
  
    if (token) {
      this.authSubject.next(true);
    }
  
    if (role) {
      this.roleSubject.next(role);
    }

  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // Token inválido
    }
  }

  login(credentials: LoginDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(async (response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.authSubject.next(true);
  
        // Llama a getRole después del login
        const headers = new HttpHeaders().set('Authorization', `Bearer ${response.token}`);
        const role = await this.http.get<string>(`${this.apiUrl}/claims`, { headers, responseType: 'text' as 'json' }).toPromise();
  
        if (role) {
          localStorage.setItem('role', role);
          this.roleSubject.next(role);
        }
      })
    );
  }
  

  register(user: Register): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user);
  }

  getProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.getRole().pipe(
      tap((role: string) => {
        const limpio = role.replace(/"/g, '');
        localStorage.setItem('role', limpio);
        this.roleSubject.next(limpio); // <--- aquí notificas el nuevo valor
        console.log('Rol guardado en localStorage:', limpio);
      }),
      switchMap(() => this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers }))
    );
  }



  getRole(): Observable<string> {

    const token = localStorage.getItem('token');
    console.log('token: ', token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<string>(`${this.apiUrl}/claims`, { headers, responseType: 'text' as 'json' });
  }


  // Método que ejecuta el pago y devuelve un Observable
  pay(totalAmount: number): Observable<any> {
    console.log(window.location.origin)
    return new Observable(observer => {
      this.http.post('https://localhost:7027/CheckOut/create-checkout-session', {
        amount: totalAmount,
        FrontendBaseUrl: window.location.origin,
        CustomerId: "cus_S4Ri5XycZW4nfj"
      }).subscribe(
        async (response: any) => {
          try {
            const stripe = await loadStripe("pk_test_51Qnj1FIS6x1axh2CfvEciA2Lak4GhqSvxmpLvzzalnQzkwKBykXhXSgf9GNV1KNELG4HMIQALwgHKKfJfCi3VmVL00wN4lk28U");
            await stripe?.redirectToCheckout({ sessionId: response.sessionId });

            observer.next(response); // Notificar éxito
            observer.complete();
          } catch (error) {
            observer.error(error); // Notificar error
          }
        },
        error => {
          observer.error(error);
        }
      );
    });
  }


  setToken(token: string) {
    localStorage.setItem('token', token);
    this.authSubject.next(true);
  }

  logout() {
    localStorage.clear();
    this.authSubject.next(false);
    this.roleSubject.next(null);

  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }




}
