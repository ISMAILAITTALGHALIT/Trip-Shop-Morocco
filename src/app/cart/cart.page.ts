import { Component, OnInit } from '@angular/core';
import {ItemCart} from '../../models/itemCart-interface';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: ItemCart[];
  total = 0;
  constructor(private storage: NativeStorage, private navCtrl: NavController) { }

  async ngOnInit() {
    this.cartItems = await this.storage.getItem('Cart');
    // tslint:disable-next-line:no-shadowed-variable
    this.cartItems.forEach((element: ItemCart) => {
      if (element.item.availability.type === 'En Magasin') {
        element.item.availability.feed = 0; // livraison nulle
      }
      this.total += element.item.availability.feed + (element.item.price * element.qty);
    });
  }


  async remove(index: number, item: ItemCart) {
  const myTotal: number = (item.qty * item.amount) + item.item.availability.feed;
  this.cartItems.splice(index, 1); // retirer un seul élement
  await this.storage.setItem('Cart', this.cartItems);
  this.total -= myTotal;
  }

  contact(item: ItemCart) {
    this.navCtrl.navigateForward(`/action-message/${'1000'}/write/${item.item.utilisateurId}`);
  }
}
