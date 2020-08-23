import { Component } from '@angular/core';

@Component({
  selector: 'app-root', //Se refleja en app.component.html
  templateUrl: './app.component.html', //vista que contiene app.component.html
  styleUrls: ['./app.component.css'] //Hoja de estilos
})
export class AppComponent {
  title = 'Bienvenido a Angular';

  curso: string = 'Curso Spring 5 con Angular 7';
  profesor: string = 'Andres Guzman';
}
