import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { User } from '../models/user';
import { IngresoEgreso } from './../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  constructor(
    private authSvc: AuthService,
    private firestore: AngularFirestore
    ) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    console.log(ingresoEgreso, this.authSvc.user.uid)
    const data = { ...ingresoEgreso };
    const newIngresoEgreso = { description: data.description, monto: data.monto, tipo: data.tipo };
    return this.firestore.doc(`${this.authSvc.user.uid}/ingresos-egresos`)
            .collection('items')
            .add({ ...newIngresoEgreso });
  }

  initIngresosEgresosListener(uid: string) {
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
                  .snapshotChanges()
                  .pipe(
                    map(snapshot => {
                      return snapshot.map( doc => ({
                          uid: doc.payload.doc.id,
                          ...doc.payload.doc.data() as any
                      }));
                    })
                  );
  }

  borrarIngresoEgreso(uidItem: string) {
    return this.firestore.doc(`${this.authSvc.user.uid}/ingresos-egresos/items/${uidItem}`).delete();
  }
}
