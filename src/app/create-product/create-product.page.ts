import { Component, OnInit } from '@angular/core';
import {Article, Availability} from '../../models/article-interface';
import {categories} from '../../models/category';
import {cities} from '../../models/cities';
import {ActionSheetController, LoadingController, NavController, ToastController} from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import {ImagePickerOptions} from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {HttpClient} from '@angular/common/http';
import {environement} from '../../models/environements';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Utilisateur} from '../../models/utilisateur-interface';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.page.html',
  styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit {
  article: Article;
  categories;
  cities;
  myPictures: string[] = [];
  myPic: string[] = [];
  imgUploaded = false;
  numImgUpload = 0;
  utilisateur: Utilisateur;
  constructor(private actionSheet: ActionSheetController, private imagePicker: ImagePicker,
              private camera: Camera, private transfer: FileTransfer,
              private http: HttpClient, private storage: NativeStorage,
              private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              private navCtrl: NavController, private webview: WebView) {
    this.article = {} as Article;
    this.article.availability = {} as Availability;
    this.article.pictures = [];
    this.categories = categories;
    this.cities = cities;
    this.article.averageStar = 1;
    this.article.createdAt = new Date().getTime();
  }

  async ngOnInit() {
    this.utilisateur = await this.storage.getItem('Utilisateur');
    // this.utilisateur.id = '5d4c3c4a910eec1634e2c996';
    // this.storage.setItem('Utilisateur', this.utilisateur);
    this.article.owner = this.utilisateur.username;
  }
  async uploadImages(images: string[]) {
    console.log('My Images loaded:', images);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < images.length; i++) {
      const element: string = images[i];
      // on stocke le nom de l'image dans la variable 'elementName'
      let elementName: string;
      elementName = element.substr(element.lastIndexOf('/') + 1);
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
        const data = await fileTransfer.upload(element, url, options);
        // on récupère l'id de l'image qui vient d'etre uploadé
        const id: string = JSON.parse(data.response)._id;
        console.log('id', id);
        this.article.pictures.push(id);
        // on incrémente le numbre d'images uploadées de 1
        this.numImgUpload += 1;
      }
      if (this.numImgUpload === images.length) {
        // si le nombre d'images uploadées = à la longeur du tablear alors :
        this.imgUploaded = true;
      }
    }
    return true;
  }
 /* async create() {
    this.article.availability.available = true; // lorsque un article vient d'etre crée il est disponible
    console.log('article', this.article);
    const loading = await this.loadingCtrl.create({
      message: 'Chargement...'
    });
    loading.present();
    try {
      if (this.article.availability.type === 'Livraison') {
        this.article.availability.address = undefined;
      } else {
        this.article.availability.feed = 0;
      }
      const flag = await this.uploadImages(this.myPictures);
      const url = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}/articles`;
      if (flag) {
        this.http.post(url, this.article, { headers: { 'Content-Type': 'application/json'}})
            .subscribe(data => {
              loading.dismiss();
              console.log('article', data);
              // Cacher le loading controller
              this.presentToast('Création réussie !', 2000);
              this.navCtrl.navigateBack('/home');
              // Afficher un message Toast et retourner à la page home
            }, error => {
              loading.dismiss();
              console.log('error', error);
              // Cacher le loading controller
              this.presentToast('Echec de création !', 2000);
              // Afficher toast
            });
            }
    } catch (e) {
      console.log('error', e);
      loading.dismiss();
    }
  }
*/
  async create() {
    this.article.availability.available = true;
    console.log('article', this.article);
    // Afficher un loading Controller
    const loading = await this.loadingCtrl.create({
      message: 'Chargement...'
    });
    loading.present();
    try {
      if (this.article.availability.type === 'Livraison') {
        this.article.availability.address = undefined;
      } else {
        this.article.availability.feed = 0;
      }
      // Appeler la methode 'uploadImages'
      // const flag: boolean = await this.uploadImages(this.myPictures);
      const flag: boolean = await this.uploadImages(this.myPic);
      const url = `${environement.api_url}/Utilisateurs/${this.utilisateur.id}/articles`;
      if (flag) {
        this.http.post(url, this.article, { headers: { 'Content-Type': 'application/json'}})
       // this.http.post(url, this.article, { headers: { 'Content-Type': 'application/json', Connection: 'close'}})
            .subscribe(data => {
              loading.dismiss();
              console.log('article', data);
              // Cacher le loading controller
              this.presentToast('Création réussie !', 2000);
              this.navCtrl.navigateBack('/home');
              // Afficher un message Toast et retourner à la page home
            }, error => {
              loading.dismiss();
              console.log('error', error);
              // Cacher le loading controller
              this.presentToast('Echec de création !', 2000);
              // Afficher toast
            });
      }
    } catch (e) {
      console.log('Error catch ', e);
      loading.dismiss();
    }
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
           let pictures: string[] = [];
           pictures = await this.gelerie(4); // appel de la methode qui ouvre la galerie
           this.myPictures = [];
           this.myPic = [];
            // tslint:disable-next-line:prefer-for-of
           for (let i = 0; i < pictures.length; i++) {
                  const element = pictures[i];
                  console.log('element de pictures', element);
                  const src = this.webview.convertFileSrc(element);
                  this.myPictures.push(src);
                  // this.myPictures.push(element);
                  this.myPic.push(element);
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
              const src = this.webview.convertFileSrc(image);
              this.myPictures.push(src);
              // this.myPictures.push(image);
              this.myPic.push(image);
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

    delete(i: number) {
        this.myPictures.splice(i, 1); // retirer juste un seul élément à partir de la position i
        this.myPic.splice(i, 1);
    }

  //  afficher un message toast grace à cette methode
  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });
    toast.present();
  }
}
