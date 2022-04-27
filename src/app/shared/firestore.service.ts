import { Injectable } from '@angular/core';
// import {
//   AngularFirestore,
//   AngularFirestoreDocument,
//   AngularFirestoreCollection,
// } from '@angular/fire/compat/firestore';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore,
  query,
  collectionData,
  orderBy,
  setDoc,
  addDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, concatMap } from 'rxjs/operators';

export interface IUser {
  displayName: string;
  photoDataUrl: string;
}

export interface IMessage {
  uid: string;
  message: string;
  timeStamp: number;
}

export interface IChat extends IUser, IMessage {}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  userDoc: DocumentReference<IUser>;
  messageCollection: CollectionReference<IMessage>;
  userCollection: CollectionReference<IUser>;

  constructor(public af: Firestore) {
    // this.messageCollection = this.af.collection<IMessage>('chat', (ref) =>
    //   ref.orderBy('timeStamp', 'desc'),
    // );
    this.messageCollection = collection(this.af, 'chat') as CollectionReference<IMessage>;

    // this.userCollection = this.af.collection<IUser>('users');
    this.userCollection = collection(this.af, 'users') as CollectionReference<IUser>;
  }

  userInit(uid: string): Promise<IUser> {
    // this.userDoc = this.af.doc<IUser>(`users/${uid}`);
    this.userDoc = doc(this.af, `users/${uid}`) as DocumentReference<IUser>;

    // return this.userDoc.valueChanges().pipe(first()).toPromise(Promise);
    return docData<IUser>(this.userDoc).pipe(first()).toPromise(Promise);
  }

  userSet(user: IUser): Promise<void> {
    // return this.userDoc.set(user);
    return setDoc(this.userDoc, user);
  }

  messageAdd(message: IMessage) {
    // return this.messageCollection.add(message);
    return addDoc(this.messageCollection, message);
  }

  chatInit(): Observable<IChat[]> {
    // return this.messageCollection.valueChanges({ idField: 'messageId' }).pipe(
    //   concatMap(async (messages) => {
    //     const users = await this.userCollection
    //       .valueChanges({ idField: 'uid' })
    //       .pipe(first())
    //       .toPromise(Promise);

    //     return messages.map((message) => {
    //       const user = users.find((u) => u.uid === message.uid);
    //       return Object.assign(message, user);
    //     });
    //   }),
    // );

    return collectionData(query(this.messageCollection, orderBy('timeStamp', 'desc')), {
      idField: 'messageId',
    }).pipe(
      concatMap(async (messages) => {
        const users = (await collectionData(this.userCollection, {
          idField: 'uid',
        })
          .pipe(first())
          .toPromise(Promise)) as (IUser & { uid: string })[];

        return messages.map((message) => {
          const user = users.find((u) => u.uid === message.uid);
          return Object.assign(message, user);
        });
      }),
    );
  }
}
