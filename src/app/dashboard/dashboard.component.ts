import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setItems, unSetItems } from '../ingredo-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { IngresoEgreso } from './../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  authSubscription: Subscription;
  ingresoEgresoSubscription: Subscription;
  constructor(
    private ingresoEgresoSvc: IngresoEgresoService,
    private store: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth')
    .pipe(
      filter( auth => auth.user != null )
    )
    .subscribe(({ user }) => {
      console.log(user);
      this.ingresoEgresoSubscription = this.ingresoEgresoSvc.initIngresosEgresosListener(user.uid).subscribe((res: IngresoEgreso[]) => {
        console.log(res);
        this.store.dispatch(setItems({ items: res }));
      });
    });
  }

  ngOnDestroy() {
    this.ingresoEgresoSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }



}
