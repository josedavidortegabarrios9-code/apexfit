import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/** Marco de la app del cliente: contenido arriba y barra de navegación inferior. */
@Component({
  selector: 'app-cliente-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cliente-shell.html',
  styleUrl: './cliente-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteShell {}
