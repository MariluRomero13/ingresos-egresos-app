import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { isLoading, stopLoading } from './../shared/ui.actions';

@Component({
  selector: 'app-ingredo-egreso',
  templateUrl: './ingredo-egreso.component.html',
  styles: []
})
export class IngredoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm: FormGroup;
  loading = false;
  uiSuscription: Subscription;
  constructor(private ingresoEgresoSvc: IngresoEgresoService,
              private store: Store<AppState>) { this.createForm(); }

  ngOnInit(): void {
    this.uiSuscription = this.store.select('ui').subscribe(loading => {
      this.loading = loading.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSuscription.unsubscribe();
  }

  private createForm(): void {
    this.ingresoEgresoForm = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required)
    });
  }

  guardar(): void {
    this.store.dispatch(isLoading());
    // setTimeout(() => {
    //   // cancelar loading
    //   this.store.dispatch(stopLoading());
    // }, 2500);

    // return;
    const { descripcion, monto, tipo  } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, tipo);
    this.ingresoEgresoSvc.crearIngresoEgreso(ingresoEgreso)
    .then(() => {
      alert('Ingreso o egreso guardado correctamente');
      this.store.dispatch(stopLoading());
      this.ingresoEgresoForm.reset();
    })
    .catch(err => {
      alert('Ocurrió un error');
      this.store.dispatch(stopLoading());
    });
  }
}
