import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface RespuestaAutenticacion {
  token: string;
  tipo: string;
  id: number;
  nombre: string;
  email: string;
  roles: string[];
}

export interface SolicitudLogin {
  email: string;
  password: string;
}

export interface SolicitudRegistro {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'dripshoes_token';
  private readonly USER_KEY = 'dripshoes_user';
  private readonly API_URL = 'http://localhost:8080/api/auth';

  private usuarioSubject = new BehaviorSubject<RespuestaAutenticacion | null>(
    this.obtenerUsuarioGuardado(),
  );
  usuario$ = this.usuarioSubject.asObservable();

  login(datos: SolicitudLogin): Observable<RespuestaAutenticacion> {
    return this.http
      .post<RespuestaAutenticacion>(`${this.API_URL}/login`, datos)
      .pipe(tap((res) => this.guardarSesion(res)));
  }

  registrar(datos: SolicitudRegistro): Observable<any> {
    return this.http.post(`${this.API_URL}/registro`, datos, {
      responseType: 'text',
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): RespuestaAutenticacion | null {
    return this.usuarioSubject.getValue();
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  tieneRol(rol: string): boolean {
    return this.getUsuario()?.roles.includes(rol) ?? false;
  }

  private guardarSesion(res: RespuestaAutenticacion): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this.usuarioSubject.next(res);
  }

  private obtenerUsuarioGuardado(): RespuestaAutenticacion | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
