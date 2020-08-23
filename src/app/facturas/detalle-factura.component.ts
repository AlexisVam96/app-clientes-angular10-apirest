import { Component, OnInit } from '@angular/core';
import { FacturaService} from './services/factura.service';
import { Factura} from './models/factura';
import { ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo: string = 'Factura';

  constructor(private facturasService: FacturaService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      let id = +params.get('id');
      this.facturasService.getFactura(id).subscribe(factura => this.factura = factura);
    });
  }

}
