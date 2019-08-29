import { Component, OnInit } from '@angular/core';
import {environement} from '../../models/environements';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Article} from '../../models/article-interface';
import {HttpClient} from '@angular/common/http';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {NavController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  catTitle: string;
  articles: Article[];
  url: string;
  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient, private photoViewer: PhotoViewer, private navCtrl: NavController,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    this.catTitle = this.activatedRoute.snapshot.paramMap.get('catTitle');
    console.log('catTitle: ', this.catTitle);
    this.url = `${environement.api_url}/Articles?filter=%7B%22where%22%3A%7B%22category%22%3A%22${this.catTitle}%22%7D%7D`;
    console.log('url', this.url);
    this.loadData(this.url)
        .subscribe((data: Article[]) => {
          console.log('articles', data);
          this.articles = data;
          if (data.length === 0) {
            this.presentToast('Pas articles pour cette catégorie', 2000);
          }
        });
  }
  loadData(url: string): Observable <Article[]> {
    return this.http.get<Article[]>(url);
  }
  doRefresh($event) {
    this.loadData(this.url)
        .subscribe((data: Article[]) => {
          console.log('articles aà partir de doRefresh', data);
          this.articles = data;
          $event.target.complete(); /*tant qu'on a eu les données qu'on veut on s'arrete*/
        });
  }
  showImage(imgId: string, imgTitle: string, event) {
    event.stopPropagation();
    this.photoViewer.show(`http://178.128.169.188:3000/api/Containers/photos/download/${imgId}`,
        imgTitle,
        {share: true});
  }
  showDetails(id: string) {
    this.navCtrl.navigateForward('/product-detail/' + id);
  }
  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });
    toast.present();
  }
}
