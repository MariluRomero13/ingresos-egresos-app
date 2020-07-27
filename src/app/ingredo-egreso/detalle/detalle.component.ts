import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from './../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from './../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingEgreSubscription: Subscription;
  ingresosEgresos: IngresoEgreso[] = [];

  constructor(private store: Store<AppStateWithIngreso>, private IngEgreSvc: IngresoEgresoService) { }
  ngOnInit(): void {
    this.ingEgreSubscription = this.store.select('ingresoEgreso').subscribe(({ items }) =>  this.ingresosEgresos = items );
    this.ingresosEgresos.sort(( a, b ) => {
      if (a.tipo === '1') {
        return -1;
      } else {
        return 1;
      }
    });
  }

  ngOnDestroy(): void {
    this.ingEgreSubscription.unsubscribe();
  }

  borrarItem(uid: string) {
    this.IngEgreSvc.borrarIngresoEgreso(uid).then(
      () => Swal.fire('Borrado', 'El item de borró', 'success')
    ).catch(err => Swal.fire('error', err.message, 'error'));
  }

}
