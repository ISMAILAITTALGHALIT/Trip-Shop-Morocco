import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Observable, forkJoin} from 'rxjs';
import {Message} from '../../models/message-interface';
import {environement} from '../../models/environements';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.page.html',
  styleUrls: ['./messagerie.page.scss'],
})
export class MessageriePage implements OnInit {
  messageType = 'received';
  utilisateur: Utilisateur;
  messagesReceived: Message[];
  messagesSent: Message[];
  notifications: Notification[];
  constructor(private http: HttpClient, private storage: NativeStorage,
              private navCtrl: NavController) { }

  async ngOnInit() {
    this.utilisateur = await this.storage.getItem('Utilisateur');
    this.loadAll()
        .subscribe(results => {
          console.log('results', results);
          this.messagesReceived = results[0].reverse();
          this.messagesSent = results[1].reverse();
          this.notifications = results[2];
        });
  }

  segmentChanged($event) {
    this.messageType = $event.detail.value    ;
  }

  loadAll(event?) {
    if (event) {
      // si un evenement est passé en paramètre, on fait le 'pull refresh'
      forkJoin(this.loadReceived(), this.loadSent(), this.loadNotif())
          .subscribe(results => {
            console.log('results', results);
            this.messagesReceived = results[0].reverse();
            this.messagesSent = results[1].reverse();
            this.notifications = results[2];
            event.target.complete();
          });
    } else {
      return forkJoin(this.loadReceived(), this.loadSent(), this.loadNotif());
    }
  }
  loadReceived(event?): Observable<Message[]> {
    const url = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}/messages`;
    console.log('url', url);
    return this.http.get<Message[]>(url);
  }

  loadSent(event?): Observable<Message[]> {
    const url = `${environement.api_url}/Messages?filter[where][title]=${this.utilisateur.username}`;
    console.log('url', url);
    return this.http.get<Message[]>(url);
  }

  loadNotif(event?): Observable<Notification[]> {
    const url = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}/notifications`;
    console.log('url', url);
    return this.http.get<Notification[]>(url);
  }
//  grace à cette methode, on se déplace sur la page 'action-message' pour lire un message
    messageView(message: Message, i) {
        this.navCtrl.navigateForward(`/action-message/${message.id}/read/${'1000'}`);
    }

    messageWrite(message: Message, i) {
        this.navCtrl.navigateForward(`/action-message/${message.id}/write/${'1000'}`);
    }
}
