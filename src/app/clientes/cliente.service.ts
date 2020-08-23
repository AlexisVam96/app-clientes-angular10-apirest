import { Injectable } from '@angular/core';
//import { formatDate, DatePipe } from '@angular/common';
import {Region} from './region'
//import { CLIENTES } from './clientes.json';
import { Cliente} from './cliente';
import { of,Observable, throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';

import { Router} from '@angular/router';
//import {AuthService} from '../usuarios/auth.service';
import {URL_BACKEND} from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND + '/api/clientes';

  //private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'})

  constructor(private http: HttpClient, private router: Router) {}

/*
  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer '+ token);
    }
    return this.httpHeaders;
  }
*/


  getRegiones(): Observable<Region[]>{
    //return this.http.get<Region[]>(this.urlEndPoint + '/regiones' ,{headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        }
        )
      }),
      map((response: any)=> {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US |es');
          return cliente;
        });
        return response;
      }
    ),
    tap(response => {
      console.log('ClienteService: tap2');
      (response.content as Cliente[]).forEach( cliente => {
        console.log(cliente.nombre);
      }
      )
    }),
    );
    //Otra forma a lo de arriba
    /*return this.http.get(this.urlEndPoint).pipe(
      map( (response) => response as Cliente[])
    );*/
  }

  create(cliente: Cliente) : Observable<Cliente>{
    //return this.http.post(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()} ).pipe(
    return this.http.post(this.urlEndPoint, cliente ).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError( e => {

        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    //return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.status !=401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        //OTRA FORMA DE ENCONTRAR EL ERROR
        //if(e.status == 404 && e.error.mensaje){
      //    this.router.navigate(['/clientes']);
      //    console.error(e.error.mensaje);
      //    swal.fire('Error al editar', e.error.mensaje, 'error');
      //  }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    //return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError( e=> {

        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    //return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.agregarAuthorizationHeader()}).pipe(
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e=> {
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id );

/*METODO HEADER PARA VALIDAR TOKEN
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer '+token);
    }
*/
    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
  //    headers: httpHeaders
    });

    return this.http.request(req);
  }

}
