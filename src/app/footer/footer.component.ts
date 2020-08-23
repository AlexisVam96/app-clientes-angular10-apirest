
import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  public autor: any = {
    nombre:'Junior Alexis',
    apellido: 'Pajuelo Cieza',
    email:'alexispajuelo6@gmail.com',
  };
}
