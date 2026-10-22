import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from 'shared';
import { Carga } from '../../data/carga';
import { mensajeDeError } from '../../data/errores';
import { hoyIso } from '../../data/formato';
import { planDeHoy } from '../../data/hoy';
import { diaDeHoy, RutinaActiva } from '../../data/rutinas.models';
import { RutinasService } from '../../data/rutinas.service';
import {
  actualId, aplazar, borrarAvance, claveSesion, completar, guardarAvance, iniciarSesion, leerAvance,
  Sesion, soloAplazados, terminar,
} from '../../data/sesion-guiada';

/** «Iniciar rutina de hoy»: un ejercicio a la vez. El avance se guarda en el navegador (un registro por usuario y día). */
@Component({
  selector: 'app-entrenar',
  imports: [RouterLink],
  templateUrl: './entrenar.html',
  styleUrl: './entrenar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Entrenar {
  private readonly rutinas = inject(RutinasService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly carga = signal<Carga<RutinaActiva | null>>({ tipo: 'cargando' });
  protected readonly sesion = signal<Sesion | null>(null);
  protected readonly confirmandoReinicio = signal(false);
  private clave = '';

  /** Los ejercicios de hoy en el orden de la rutina; vacío si hoy no se entrena. */
  protected readonly ejercicios = computed(() => {
    const c = this.carga();
    const plan = c.tipo === 'listo' ? planDeHoy(c.datos, diaDeHoy()) : null;
    return plan?.tipo === 'entrena' ? plan.dia.ejercicios : [];
  });
  protected readonly total = computed(() => this.ejercicios().length);
  protected readonly actual = computed(() => {
    const s = this.sesion();
    const id = s ? actualId(s) : null;
    return this.ejercicios().find((e) => e.id === id) ?? null;
  });
  /** Su lugar en la rutina («Ejercicio 2 de 6»): un aplazado vuelve con el número que tenía. */
  protected readonly posicion = computed(() => {
    const a = this.actual();
    return a ? this.ejercicios().indexOf(a) + 1 : 0;
  });
  protected readonly soloAplazados = computed(() => {
    const s = this.sesion();
    return !!s && soloAplazados(s);
  });
  protected readonly restantes = computed(() => this.sesion()?.pendientes.length ?? 0);
  protected readonly avance = computed(() => {
    const s = this.sesion();
    return s && this.total() ? Math.round((s.completados.length / this.total()) * 100) : 0;
  });
  protected readonly resumen = computed(() => {
    const s = this.sesion();
    const nombres = (ids: number[]) => ids.map((id) => this.ejercicios().find((e) => e.id === id)?.nombre ?? `Ejercicio #${id}`);
    return { completados: nombres(s?.completados ?? []), sinHacer: nombres(s?.pendientes ?? []) };
  });

  constructor() {
    this.cargar();
  }

  protected cargar(): void {
    this.carga.set({ tipo: 'cargando' });
    this.rutinas
      .rutinaActiva()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          this.carga.set({ tipo: 'listo', datos });
          this.prepararSesion(datos);
        },
        error: (error: unknown) => this.carga.set({ tipo: 'error', mensaje: mensajeDeError(error, 'tu rutina') }),
      });
  }

  /** Retoma el avance guardado de hoy o empieza uno nuevo. */
  private prepararSesion(rutina: RutinaActiva | null): void {
    const idUsuario = this.auth.session()?.id;
    const ids = this.ejercicios().map((e) => e.id);
    if (!rutina || idUsuario === undefined || ids.length === 0) {
      this.sesion.set(null);
      return;
    }
    this.clave = claveSesion(idUsuario, hoyIso());
    this.sesion.set(leerAvance(this.clave, rutina.id, ids) ?? iniciarSesion(rutina.id, ids));
  }

  private cambiar(paso: (s: Sesion) => Sesion): void {
    const actual = this.sesion();
    if (!actual) return;
    const nueva = paso(actual);
    this.sesion.set(nueva);
    guardarAvance(this.clave, nueva);
  }

  protected completar(): void {
    this.cambiar(completar);
  }

  protected aplazar(): void {
    this.cambiar(aplazar);
  }

  protected terminar(): void {
    this.cambiar(terminar);
  }

  protected pedirReinicio(): void {
    this.confirmandoReinicio.set(true);
  }

  protected cancelarReinicio(): void {
    this.confirmandoReinicio.set(false);
  }

  protected reiniciar(): void {
    const c = this.carga();
    this.confirmandoReinicio.set(false);
    borrarAvance(this.clave);
    this.prepararSesion(c.tipo === 'listo' ? c.datos : null);
  }
}
