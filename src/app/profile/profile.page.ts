import { Component, OnInit } from '@angular/core';
import {Utilisateur} from '../../models/utilisateur-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ImagePickerOptions} from '@ionic-native/image-picker';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {ActionSheetController, LoadingController, NavController, ToastController} from '@ionic/angular';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer/ngx';
import {environement} from '../../models/environements';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Article} from '../../models/article-interface';
import {error} from 'selenium-webdriver';
import {WebView} from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileType = 'Profil';
  utilisateur = {} as Utilisateur;
  imgUploaded = false;
  articles: Article[];
  myPic: string;
  constructor(private storage: NativeStorage, private camera: Camera,
              private imagePicker: ImagePicker, private actionSheet: ActionSheetController,
              private transfer: FileTransfer, private http: HttpClient,
              private toastCtrl: ToastController, private loadingCtrl: LoadingController,
              private navCtrl: NavController, private webview: WebView) { }

  async ngOnInit() {
      this.utilisateur = await this.storage.getItem('Utilisateur');
      console.log('utilisateur storage', this.utilisateur);
      if (this.utilisateur.avatar === '') {
      this.utilisateur.avatar = 'https://ionicframework.com/docs/demos/api/avatar/avatar.svg';
    }
      /*else {
          console.log('avatar existe deja: ', this.utilisateur.avatar);
          this.utilisateur.avatar = `http://178.128.169.188:3000/api/Containers/photos/download/${this.utilisateur.avatar}`;
      }*/
      this.loadData()
        .subscribe(articles => {
          console.log('articles loaded', articles);
          this.articles = articles.reverse();
        });
  }

    segmentChanged($event) {
        console.log('event', $event);
        this.profileType = $event.detail.value;
    }

  async gelerie(imageNum: number) {
    const options: ImagePickerOptions = {
      maximumImagesCount: imageNum,
      outputType: 0,
      quality: 100
    };
    return this.imagePicker.getPictures(options);
  }
  async getCam() {
    const options: CameraOptions = {
      sourceType: 1,
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    return this.camera.getPicture(options);
  }
  async action() {
    const actionSheet = await this.actionSheet.create({
      header: 'Selectionner la source',
      buttons: [
        {
          text: 'Galerie',
          icon: 'images',
          handler: async () => {
            console.log('galerie');
            const pictures: string[] = await this.gelerie(1); // appel de la methode qui ouvre la galerie
            for (let i = 0; i < pictures.length; i++) {
              const element = pictures[i];
              console.log('element de pictures', element);
              this.myPic = element;
              const src = this.webview.convertFileSrc(element);
              this.utilisateur.avatar = src;
              // this.utilisateur.avatar = element;
            }
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera');
            this.getCam().then(image => {
              console.log('image', image);
              this.myPic = image;
              const src = this.webview.convertFileSrc(image);
              this.utilisateur.avatar = src;
              // this.utilisateur.avatar = image;
            });
          }
        },
        {
          text: 'Annuler',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  async uploadImages(image: string) {
    console.log('My Image loaded:', image);
      // on stocke le nom de l'image dans la variable 'elementName'
    let elementName: string;
    elementName = image.substr(image.lastIndexOf('/') + 1);
    console.log('elementName', elementName);
      // on initialise l'objet 'fileTransfer'
    const fileTransfer: FileTransferObject = this.transfer.create();
      // tslint:disable-next-line:no-shadowed-variable
    const url = `${environement.api_url}/Containers/photos/upload`;
    console.log('url', url);
      // on détermine les options d'upload de fichiers
    const options: FileUploadOptions = {
        fileKey: 'Shopping',
        fileName: elementName,
        chunkedMode: false,
        mimeType: 'image/jpeg',
        headers: {}
      };
    if (!this.imgUploaded) {
        // on upload l'image et on stocke le résultat dans 'data'.
        const data = await fileTransfer.upload(image, url, options);
        // on récupère l'id de l'image qui vient d'etre uploadé
        const id: string = JSON.parse(data.response)._id;
        console.log('id', id);
        // this.utilisateur.avatar = id;
        this.imgUploaded = true;
        return id;
      }

  }

  async updateProfile() {
    console.log('utilisateur', this.utilisateur);
    // const flag = await this.uploadImages(this.utilisateur.avatar);
    const flag: string = await this.uploadImages(this.myPic);
    if (flag) {
      // this.utilisateur.avatar = flag;
        this.utilisateur.avatar = `http://178.128.169.188:3000/api/Containers/photos/download/${flag}`;
        const url = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}`;
        this.http.put(url, this.utilisateur)
          .subscribe(async result => {
            // Afficher un message toast
            console.log('result', result);
            await this.storage.setItem('Utilisateur', result);
            this.presentToast('Mise à jour réussie !', 2000);
          }, error => {
            console.log('echec', error);
            this.presentToast('Echec de la mise à jour !', 2000);
          });
    }
  }

  //  afficher un message toast grace à cette methode
  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });
    toast.present();
  }

    loadData(): Observable <Article[]> {
        const id = this.utilisateur.id;
        const url = `${environement.api_url}/Utilisateurs/${id}/articles`;
        return this.http.get<Article[]>(url);
    }

    updateArticle(article: Article, i: number) {
      console.log('article', i);
      this.navCtrl.navigateForward('/edit-product/' + article.id);
    }

    async deleteArticle(article: Article, i: number) {
      const loading = await this.loadingCtrl.create({
        message: 'Suppression en cours'
      });
      loading.present();
      console.log(i);
      // tslint:disable-next-line:prefer-for-of no-shadowed-variable
      for (let i = 0; i < article.pictures.length; i++) {
        // tslint:disable-next-line:no-shadowed-variable
        const url = `${environement.api_url}/Containers/photos/files/${article.pictures[i]}`;
        this.http.delete(url)
            .subscribe(deleted => {
              console.log('image deleted ', deleted);
            });
      }
      const url = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}/articles/${article.id}`;
      this.http.delete(url)
          .subscribe(result => {
            console.log('article deleted', result);
            loading.dismiss();
            this.presentToast('Article deleted', 2000);
          }, error => {
            console.log('echec de suppression', error);
            loading.dismiss();
          });
    }

  doRefresh($event) {
    this.loadData()
        .subscribe((data: Article[]) => {
          console.log('mes articles à partir de doRefresh', data);
          this.articles = data.reverse();
          $event.target.complete(); /*tant qu'on a eu les données qu'on veut on s'arrete*/
        });
  }
}
