/* tslint:disable:prefer-const */
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Article} from '../../models/article-interface';
import {environement} from '../../models/environements';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {delay} from 'rxjs/operators';
import {NavController, ToastController} from '@ionic/angular';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {ItemCart} from '../../models/itemCart-interface';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  article: Article;
  rate: any;
  slidesOpt = {
    speed: 1000,
    autoplay: {
        delay: 500
    }
  };
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
              private photoViewer: PhotoViewer, private toastCtrl: ToastController,
              private storage: NativeStorage, private navCtrl: NavController,
              private sharing: SocialSharing) { }

  ngOnInit() {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id: ', id);
    this.loadData(id)
        .subscribe(data => {
          this.article = data;
        });
  }

  async share() {
    try {
      await this.sharing.share(
          this.article.title,
          null,
          null,
          `https://example.com/product-detail/${this.article.id}`
      );
      console.log('partage réussi !');
    } catch (e) {
      console.log('error', e);
    }
  }
  onModelChange($event) {
    console.log('event', $event);
  }

  loadData(id: string): Observable <Article> {
    const url = `${environement.api_url}/Articles/${id}`;
    return this.http.get<Article>(url);
  }

  showImage(imgId: string, imgTitle: string) {
    try {
      event.stopPropagation();
      this.photoViewer.show(`http://178.128.169.188:3000/api/Containers/photos/download/${imgId}`,
          imgTitle,
          {share: true});
    } catch (e) {
      console.log('probleme de photoViewer', e);
    }
  }

  leaveNote(): void {
    console.log('rate', this.rate);
    const average: number = (this.article.averageStar + this.rate) / 2;
    const aroundi: number = Math.ceil(average); /*Pour prendre la partie entiere ex: ceil(1.04)=1, ceil(1.95)=2*/
    const utilisateurId = this.article.utilisateurId;
    const articleId = this.article.id;
    const url = `${environement.api_url}/Utilisateurs/${utilisateurId}/Articles/${articleId}`;
    console.log('url', url);
    this.http.put(url, {averageStar: aroundi})
        .subscribe(res => {
          this.presentToast('Attribution de la note avec succés', 2000);
        });
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });
    toast.present();
  }

/*  async addToCart(item: Article) {
    try {
      let added = false;
      let data: ItemCart[] = [];
      data = await this.storage.getItem('Cart');
      console.log('data', data);
      // si le panier est vide
      if (data === null || data.length === 0) {
        data.push({
          item,
          qty: 1,
          amount: item.price
        });
      } else {
        for (let i = 0; i <= data.length; i + 1) {
        let element: ItemCart = data[i];
        if (item.id === element.item.id) {
          element.qty += 1;
          element.amount = item.price;
          added = true;
        }
        }
      }
      if (!added) {
        // si added est tjrs false cad le panier est vide ne contient aucun article
        data.push ({
          item,
          qty: 1,
          amount: item.price
        });
      }
      await this.storage.setItem('Cart', data);
      this.presentToast('votre panier a été mis à jour', 1500);
    } catch (e) {
        // tslint:disable-next-line:prefer-const
      let myData: ItemCart[] = [];
      console.log('erreur: ', e);
      if (e.code === 2) {
      myData.push({
          item,
          qty: 1,
          amount: item.price
        });
      await this.storage.setItem('Cart', myData);
      this.presentToast('votre panier a été mis à jour', 1500);
      }
    }
  }
*/
  async addToCart(item: Article) {
    try {
      let data: ItemCart[];
      let added = false;
      data = await this.storage.getItem('Cart');
      console.log('data', data);
      // on vérifie si le panier est vide
      if (data === null || data.length === 0) {
        data.push({
          item,
          qty: 1,
          amount: item.price
        });
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < data.length; i++) {
          const element: ItemCart = data[i];
          if (item.id === element.item.id) {
            // le panier contient déjà cette article
            element.qty += 1;
            element.amount += item.price;
            added = true;
          }
        }
      }
      if (!added) {
        // le panier n'est pas vide et ne contient pas l'article
        data.push({
          item,
          qty: 1,
          amount: item.price
        });
      }
      await this.storage.setItem('Cart', data);
      this.presentToast('Votre panier a été mis à jour', 1500);
    } catch (e) {
      let myData: ItemCart[] = [];
      console.log('error', e);
      if (e.code === 2) {
        myData.push({
          item,
          qty: 1,
          amount: item.price
        });
        await this.storage.setItem('Cart', myData);
        this.presentToast('Votre panier a été mis à jour', 1500);
      }
    }
  }

  openCart() {
    this.navCtrl.navigateForward('/cart');
  }
}
