import { Routes } from '@angular/router';
import { EstadisticaComponent } from './../ingredo-egreso/estadistica/estadistica.component';
import { IngredoEgresoComponent } from './../ingredo-egreso/ingredo-egreso.component';
import { DetalleComponent } from './../ingredo-egreso/detalle/detalle.component';

export const dashboardRoutes: Routes = [
  { path: '', component: EstadisticaComponent },
  { path: 'ingreso-egreso', component: IngredoEgresoComponent },
  { path: 'detalle', component: DetalleComponent }
];
