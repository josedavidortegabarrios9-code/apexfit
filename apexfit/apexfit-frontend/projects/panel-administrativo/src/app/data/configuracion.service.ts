import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_URL } from 'shared';
import { guardarDias, leerDias, normalizarDias } from './inactividad.config';

export interface InactividadResponse {
  dias: number;
}

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private readonly http = inject(HttpClient, { optional: true });
  private readonly apiUrl = inject(API_URL, { optional: true });

  obtenerDiasInactividad(): Observable<number> {
    if (!this.http || !this.apiUrl) {
      return of(leerDias());
    }
    return this.http.get<InactividadResponse>(`${this.apiUrl}/configuracion/inactividad`).pipe(
      map((res) => normalizarDias(res?.dias)),
      tap((dias) => guardarDias(dias)),
      catchError(() => of(leerDias())),
    );
  }

  guardarDiasInactividad(dias: number): Observable<number> {
    const normalizado = normalizarDias(dias);
    guardarDias(normalizado);
    if (!this.http || !this.apiUrl) {
      return of(normalizado);
    }
    return this.http
      .put<InactividadResponse>(`${this.apiUrl}/configuracion/inactividad`, { dias: normalizado })
      .pipe(
        map((res) => normalizarDias(res?.dias)),
        tap((guardado) => guardarDias(guardado)),
        catchError(() => of(normalizado)),
      );
  }
}
