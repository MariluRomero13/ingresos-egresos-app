import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
import { IngresoEgreso } from './../../models/ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {
  ingresos = 0;
  egresos = 0;
  totalEgresos = 0;
  totalIngresos = 0;
  constructor(private store: Store<AppStateWithIngreso>) { }

  ngOnInit(): void {
  this.store.select('ingresoEgreso')
    .subscribe(({ items }) => {
      this.generarEstadistica(items);
    });
  }

  generarEstadistica(items: IngresoEgreso[]) {
    for (const item of items) {
      if (item.tipo === '0') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }
  }
}
