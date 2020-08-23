import { Component, OnInit } from '@angular/core';
import { Cliente} from './cliente';
import { ClienteService} from './cliente.service';
import {ModalService} from './detalle/modal.service';
import swal from 'sweetalert2';
import {tap} from 'rxjs/operators';
import { ActivatedRoute} from '@angular/router';
import {AuthService} from '../usuarios/auth.service';
import {URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  urlBackend: string = URL_BACKEND;

  //INYECTAMOS LOS METODOS EN EL CONSTRUCTOR PARA QUE PODAMOS
  //UTILIZARLOS EN LA PLANTILLA HTML
  constructor(private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute,
  public authService: AuthService,
  private modalService: ModalService) {  }

  ngOnInit(): void {
    /**primera forma
    this.clienteService.getClientes().subscribe(
      function (clientes) {
        this.clientes = clientes
      }
    );
    segunda forma mas simplificado*/
    this.activatedRoute.paramMap.subscribe( params => {
    let page: number = + params.get('page');

    if(!page){
      page=0;
    }

    this.clienteService.getClientes(page).pipe(
      tap(response => {
        console.log('ClienteService: tap 3');
        (response.content as Cliente[]).forEach( cliente =>   console.log(cliente.nombre) );
      })
    ).subscribe(  response => {
      this.clientes = response.content as Cliente[]
      this.paginador = response;
    });
  });

  this.modalService.notificarUpload.subscribe((cliente: { id: number; foto: string; }) => {
    this.clientes = this.clientes.map(clienteOriginal => {
      if(cliente.id == clienteOriginal.id){
        clienteOriginal.foto= cliente.foto;
      }
      return clienteOriginal;
    })
  })
  }

  delete(cliente: Cliente): void{
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
    title: 'Está seguro?',
    text: `¡Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, cancelar!',
    reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.delete(cliente.id).subscribe(
            response => {
              this.clientes = this.clientes.filter(cli => cli !== cliente)
              swalWithBootstrapButtons.fire(
                'Cliente Eliminado',
                `Cliente ${cliente.nombre} eliminado con éxito.`,
                'success'
              )
            }
          )
        }
      })
    }

    abrirModal(cliente : Cliente){
      this.clienteSeleccionado = cliente;
      this.modalService.abrirModal();
    }
}
