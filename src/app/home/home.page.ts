import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environement} from '../../models/environements';
import {Article} from '../../models/article-interface';
import {Observable} from 'rxjs';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  articles: Article[];
  constructor(private http: HttpClient, private photoViewer: PhotoViewer, private navCtrl: NavController) {}
  ngOnInit() {
    this.loadData()
      .subscribe((data: Article[]) => {
      this.articles = data;
      // for (let i = 0; i < 5; i++) {
        // tslint:disable-next-line:max-line-length
        // ojoute les memes éléments au tablear 'articles' pour pouvoir utiliser le 'virtual scroll' car on doir avoir au moins vingt articles
       //   this.articles.push(...data);
      // }
      const rev = this.articles.reverse();
      console.log('articles', this.articles);
      console.log('articles', rev);
      });
  }

  loadData(): Observable <Article[]> {
    const url = `${environement.api_url}/Articles`;
    return this.http.get<Article[]>(url);
  }

  doRefresh($event) {
    this.loadData()
        .subscribe((data: Article[]) => {
          console.log('articles à partir de doRefresh', data);
          this.articles = data.reverse();
          $event.target.complete(); /*tant qu'on a eu les données qu'on veut on s'arrete*/
        });
  }
  showImage(imgId: string, imgTitle: string, event) {
    event.stopPropagation();
    this.photoViewer.show(`http://178.128.169.188:3000/api/Containers/photos/download/${imgId}`,
        imgTitle,
        {share: true});
  }

  onSearch(event): void {
    const value: string = event.target.value;
    if (value) {
    this.articles = this.articles.filter((article) => {
      return article.title.toLowerCase().includes(value.toLowerCase());
    });
    }
  }

  onCancel(event) {
    this.loadData()
        .subscribe((data: Article[]) => {
          console.log('articles', data);
          this.articles = data;
        });
  }

  showDetails(id: string) {
  this.navCtrl.navigateForward('/product-detail/' + id);
  }

    goToCreate() {
      this.navCtrl.navigateForward('/create-product');
    }
}
