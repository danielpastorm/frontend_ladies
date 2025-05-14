import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FechaPeriodo } from '../Data/perfil.types';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PerfilServiceService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl + "User";


  RegistrarPeriodo(fechas: FechaPeriodo): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrarPeriodo`, fechas );
  }

  ObtenerPeriodo(IdUsuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ultimo/${IdUsuario}`);
  }

}
