import { Component, OnInit } from '@angular/core';
import {Utilisateur} from '../../models/utilisateur-interface';
import {Message} from '../../models/message-interface';
import {ActivatedRoute} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ToastController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {environement} from '../../models/environements';

@Component({
  selector: 'app-action-message',
  templateUrl: './action-message.page.html',
  styleUrls: ['./action-message.page.scss'],
})
export class ActionMessagePage implements OnInit {
  action: string;
  id: string;
  uid: string;
  message: Message;
  msgContent = '';
  utilisateur: Utilisateur;
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
              private storage: NativeStorage, private toastCtrl: ToastController) { }

  async ngOnInit() {
    // on récupère les paramètres  id, action et uid
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action');
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid');
    // on affiche les paramètres dans la console
    console.log('route params', this.id, this.action, this.uid);
    //  on recupère le contenu de la clé 'Utilisateur' de notre local storage
    // et on stocke ça dans la propriété utilisateur
    this.utilisateur = await this.storage.getItem('Utilisateur');
    // on verifie si l'utilisateur vient de la page 'cart' ou 'messagerie'
    if (this.id === '1000') {
      this.message = {} as Message;
    } else {
      this.loadMessage()
          .subscribe(message => {
            console.log('message', message);
            this.message = message;
          });
    }
  }

  toggleAction() {
    this.action = 'write';
  }

  //  on affiche un message toast grace à cette methode
  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });
    toast.present();
  }
  send() {
    // dans sera stocké l'id de celui qui recevra le message
    let id: string;
    const pictureId = this.message.picture;
    const url1 = `${environement.api_url}/Utilisateurs/findOne?filter[where][avatar]=${pictureId}`;
    this.http.get<Utilisateur>(url1)
        .subscribe(result => {
          // une fois qu'on a l'id de l'utilisateur, on crée le message
          id = result.id;
          const url = `${environement.api_url}/Utilisateurs/${id}/messages`;
          let message: Message;
          message = {
            title: this.utilisateur.username,
            picture: this.utilisateur.avatar,
            content: this.msgContent,
            createdAt: new Date().getTime(),
            read: false,
            messageTo: id
          };
          console.log('url et message', url, message);
          // on le poste
          this.http.post(url, message)
              .subscribe(data => {
                // en cas de réussite, on affiche un message et on vide le champs
                console.log('data', data);
                this.presentToast('Envoyé', 1000);
                this.msgContent = '';
              }, error => {
                // en cas d'erreur, on affiche un message
                console.log('error', error);
                this.presentToast('Non envoyé', 1000);
              });
        });
  }
  loadMessage() {
    const url = `${environement.api_url}/Messages/${this.id}`;
    return this.http.get<Message>(url);
  }

  contact() {
    console.log('contact');
    // on stocke l'id de celui qui recevra le message
    const id = this.uid;
    const url = `${environement.api_url}/Utilisateurs/${id}/messages`;
    //  on crée le message
    let message: Message;
    message = {
      title: this.utilisateur.username,
      picture: this.utilisateur.avatar,
      content: this.msgContent,
      createdAt: new Date().getTime(),
      read: false,
      messageTo: id
    };
    console.log('url et message', url, message);
    // on le poste...
    this.http.post(url, message)
        .subscribe(data => {
          console.log('data', data);
          this.presentToast('Envoyé', 1000);
          this.msgContent = '';
        }, error => {
          console.log('error', error);
          this.presentToast('Non envoyé', 1000);
        })
  }
}
