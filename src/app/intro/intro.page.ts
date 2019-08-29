import { Component, OnInit } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {Utilisateur} from '../../models/utilisateur-interface';
import {environement} from '../../models/environements';
import {HttpClient} from '@angular/common/http';
import {__await} from 'tslib';
import {NavController} from '@ionic/angular';
import {error} from 'selenium-webdriver';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

    utilisateur = {} as Utilisateur;
  constructor(private fb: Facebook, private storage: NativeStorage, private http: HttpClient, private navCtrl: NavController) { }

  ngOnInit() {
  }
    //  'user_friends',
  loginWithFacebook(): void {
    this.fb.login(['public_profile', 'email'])
        .then((res: FacebookLoginResponse) => {
            console.log('Logged into Facebook!', res);
            this.fb.api('me?fields=email', [])
                .then(async profil => {
                const email: string = profil.email;
                this.utilisateur = {
                        contact: email,
                        type: 'email',
                        avatar: '',
                        username: ''
                    }
                await this.storage.setItem('isLoggedIn', true);
                await this.verifFacebook(profil.email);
                /*enregistrer l'utilisateur dans mongodb*/
                // const url = `${environement.api_url}/Utilisateurs`;
                // this.http.post(url, this.utilisateur)
                //         .subscribe(async user => {
                //            await this.storage.setItem('Utilisateur', user);
                //           /*naviguer vers la page d'acceuil*/
                //            console.log('user', user);
                //            this.navCtrl.navigateRoot('/home');
                //         });
             });
        })
        .catch(e => console.log('Error logging into Facebook', e));
  }
  loginWithPhone() {
    (window as any).AccountKitPlugin.loginWithPhoneNumber(
        {
          useAccessToken: true,
          defaultCountryCode: 'MA',
          facebookNotificationsEnabled: true
        }, (success) => {
          console.log('success', success);
          (window as any).AccountKitPlugin.getAccount(
              async account => {
                  console.log('success', account);
                  this.utilisateur = {
                      contact: account.phoneNumber,
                      type: 'phone',
                      avatar: '',
                      username: ''
                  }
                  await this.storage.setItem('isLoggedIn', true);
                  await this.verifPhone(account.phoneNumber);
                  /*enregistrer l'utilisateur dans mongodb*/
                  // const url = `${environement.api_url}/Utilisateurs`;
                  // this.http.post(url, this.utilisateur)
                    //  .subscribe(async user => {
                      //    await this.storage.setItem('Utilisateur', user);
                        //  console.log('utilisateur bien enregistré ................................................');

                          /*naviguer vers la page d'acceuil*/
                          // console.log('user', user);
                          // this.navCtrl.navigateRoot('/home');

                     // });
              }, (fail => {
                console.log('fail', fail);
              }));
        }, (failure) => {
            console.log('login with phone failed ................................................');
            console.log('error', failure);
        });
  }
  verifPhone(phone: string) {
      let c: boolean;
      const chaine = phone.substr(1);
      const contact = '%2B' + chaine; // cela va enlever le "+" ...
      const url0 = `${environement.api_url}/Utilisateurs/findOne?filter[where][contact]=${contact}`;
      this.http.get<Utilisateur>(url0)
          .subscribe( result => {
              console.log('result', result);
              this.storage.setItem('Utilisateur', result);
              const cont = result.contact;
              // si le numero de téléphone ne correspond à aucun utilisateur
              if (cont !== '') {
                  console.log('le contact existe deja');
                  c = true;
                  this.navCtrl.navigateForward('home');
                  // return true; // le contact existe deja
              } else {
                  console.log('le contact n existe pas');
                  const url = `${environement.api_url}/Utilisateurs`;
                  this.http.post(url, this.utilisateur)
                      .subscribe(async user => {
                          await this.storage.setItem('Utilisateur', user);
                          console.log('utilisateur bien enregistré ................................................');

                          /*naviguer vers la page d'acceuil*/
                          console.log('user', user);
                          this.navCtrl.navigateRoot('/home');

                      });
                  c = false;
                  // return false; // le contact n'existe pas
              }
              console.log(c);
              // return c;
          }, error1 => {
              const url1 = `${environement.api_url}/Utilisateurs`;
              this.http.post(url1, this.utilisateur)
                  .subscribe(async user => {
                      await this.storage.setItem('Utilisateur', user);
                      console.log('utilisateur bien enregistré ................................................');
                      /*naviguer vers la page d'acceuil*/
                      console.log('user', user);
                      this.navCtrl.navigateRoot('/home');
                  });
          });
  }
  verifFacebook(newContact: string) {
      let c: boolean;
      const url0 = `${environement.api_url}/Utilisateurs/findOne?filter[where][contact]=${newContact}`;
      this.http.get<Utilisateur>(url0)
          .subscribe( result => {
              console.log('result', result);
              this.storage.setItem('Utilisateur', result);
              const oldContact = result.contact;
              // si le compte facebook ne correspond à aucun utilisateur
              if (oldContact !== '') {
                  console.log('le contact existe deja');
                  c = true;
                  this.navCtrl.navigateForward('home');
              } else {
                  const url1 = `${environement.api_url}/Utilisateurs`;
                  this.http.post(url1, this.utilisateur)
                      .subscribe(async user => {
                          await this.storage.setItem('Utilisateur', user);
                          console.log('utilisateur bien enregistré ................................................');
                          /*naviguer vers la page d'acceuil*/
                          console.log('user', user);
                          this.navCtrl.navigateRoot('/home');
                      });
              }
          }, error1 => {
              const url1 = `${environement.api_url}/Utilisateurs`;
              this.http.post(url1, this.utilisateur)
                  .subscribe(async user => {
                      await this.storage.setItem('Utilisateur', user);
                      console.log('utilisateur bien enregistré ................................................');
                      /*naviguer vers la page d'acceuil*/
                      console.log('user', user);
                      this.navCtrl.navigateRoot('/home');
                  });
          });
  }

}
