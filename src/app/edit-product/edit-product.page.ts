import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Article, Availability} from '../../models/article-interface';
import {environement} from '../../models/environements';
import {NavController, ToastController} from '@ionic/angular';
import {categories} from '../../models/category';
import {cities} from '../../models/cities';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  categories: any[];
  cities: any[];
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
              private toastCtrl: ToastController, private navCtrl: NavController) {
    this.categories = categories;
    this.cities = cities;
  }
  article = {} as Article;
  ngOnInit() {
    this.article.availability = {} as Availability;
    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('article id récupéré à partir du lien', id);
    this.loadData(id)
        .subscribe(data => {
          this.article = data;
        });
  }

  loadData(id: string): Observable <Article> {
    const url = `${environement.api_url}/Articles/${id}`;
    return this.http.get<Article>(url);
  }

  updateArticle() {
    console.log('article', this.article);
    const id: string = this.article.utilisateurId;
    const articleId: string = this.article.id;
    const url = `${environement.api_url}/Utilisateurs/${id}/articles/${articleId}`;
    this.http.put(url, this.article)
        .subscribe(result => {
          this.presentToast('Mise à jour réussie !', 2000);
          this.navCtrl.navigateBack('/profile');
        }, error => {
          this.presentToast('Echec de la mise à jour !', 2000);
          console.log('echec', error);
        })
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });
    toast.present();
  }
}
