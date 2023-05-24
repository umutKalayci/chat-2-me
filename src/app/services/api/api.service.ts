import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private firestore: Firestore) {}

  docRef(path: any) {
    return doc(this.firestore, path);
  }

  setDocument(path: any, data: any) {
    const dataRef = this.docRef(path);
    return setDoc<any>(dataRef, data); //set()
  }

  getDocById(path: any) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }
}
