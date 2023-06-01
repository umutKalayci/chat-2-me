import {
  addDoc,
  deleteDoc,
  collection,
  collectionData,
  updateDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  OrderByDirection,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private firestore: Firestore) {}

  docRef(path: string) {
    return doc(this.firestore, path);
  }

  collectionRef(path: any) {
    return collection(this.firestore, path);
  }

  setDocument(
    path: string,
    data: { email: any; name: any; uid: string; photo: string }
  ) {
    const dataRef = this.docRef(path);
    return setDoc<any>(dataRef, data); //set()
  }

  updateDocument(
    path: string,
    data: { email: any; name: any; uid: string; photo: string }
  ) {
    const dataRef = this.docRef(path);
    return updateDoc<any>(dataRef, data); //set()
  }
  addDocument(path: any, data: any) {
    const dataRef = this.collectionRef(path);
    return addDoc<any>(dataRef, data); //add()
  }

  deleteDocument(path: any, docId: any) {
    return deleteDoc(doc(this.firestore, path, docId));
  }

  getDocById(path: string) {
    const dataRef = this.docRef(path);
    return getDoc(dataRef);
  }

  getDocs(path: any, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    return getDocs<any>(dataRef); //get()
  }

  getDocsWithMultiQuery(path: any, queryFn?: any[]) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      for (let i = 0; i < queryFn.length; i++) {
        dataRef = query(dataRef, queryFn[i]);
      }
    }
    return getDocs<any>(dataRef); //get()
  }

  collectionDataQuery(path: any, queryFn?: any) {
    let dataRef: any = this.collectionRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    const collection_data = collectionData<any>(dataRef, { idField: 'id' }); // valuechanges, for doc use docData
    return collection_data;
  }

  docDataQuery(path: any, id?: any, queryFn?: any) {
    let dataRef: any = this.docRef(path);
    if (queryFn) {
      const q = query(dataRef, queryFn);
      dataRef = q;
    }
    let doc_data;
    if (id) doc_data = docData<any>(dataRef, { idField: 'id' });
    else doc_data = docData<any>(dataRef); // valuechanges, for doc use docData
    return doc_data;
  }

  whereQuery(fieldPath: any, condition: any, value: any) {
    return where(fieldPath, condition, value);
  }

  orderByQuery(fieldPath: any, directionStr: OrderByDirection = 'asc') {
    return orderBy(fieldPath, directionStr);
  }
}
