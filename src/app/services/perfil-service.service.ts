import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FechaPeriodo } from '../Data/perfil.types';


@Injectable({
  providedIn: 'root'
})
export class PerfilServiceService {

  constructor(private http: HttpClient) { }
  private isProd = true;
  private apiUrl = this.isProd ? "/User" : 'https://localhost:7027/User'


  RegistrarPeriodo(fechas: FechaPeriodo): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrarPeriodo`, fechas );
  }

}
