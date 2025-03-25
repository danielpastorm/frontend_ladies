import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { loadStripe } from '@stripe/stripe-js';

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


  public public_role: string = "";


  
  // https://localhost:7027
  private local = 'https://localhost:7027/Auth'

  isprod: boolean = true;
  private apiUrl = this.isprod ? 'https://Ladies-First.shop/Auth' : this.local;

  constructor(private http: HttpClient) {

  }

  login(credentials: LoginDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(user: Register): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user);
  }

  getProfile(): Observable<UserProfile> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.getRole().pipe(
      tap((role: string) => {
        localStorage.setItem('role', role);
        console.log('Rol guardado en localStorage:', role);
      }),
      switchMap(() => this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers }))
    );
  }

  

  getRole(): Observable<string> {
    
    const token = localStorage.getItem('token');
    console.log('token: ' , token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<string>(`${this.apiUrl}/claims`, { headers, responseType: 'text' as 'json'  });
  }


  // Método que ejecuta el pago y devuelve un Observable
  pay(totalAmount: number): Observable<any> {
    return new Observable(observer => {
      this.http.post('/CheckOut/create-checkout-session', {
        amount: totalAmount,
        frontendBaseUrl: window.location.origin
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



  
}
