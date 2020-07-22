import {Component, OnInit, Input} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, combineLatest} from 'rxjs';
import {AppState} from 'src/app/reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {map, take, tap, withLatestFrom} from 'rxjs/operators';
import {Product} from 'src/app/home/product/model/product';
import {selectOneProduct} from 'src/app/home/product/store/product.selector';
import {PRODUCT_ACTIONS} from 'src/app/home/product/store/product.actions';
import {setConditionClass} from 'src/app/home/product/constants/functions';
import { selectOneUserProduct, selectUserProducts} from 'src/app/user-menu/store/user-product.selectors';
import {AlertController, ModalController} from '@ionic/angular';
import {USER_PRODUCT_ACTIONS} from '../../user-menu/store/user-product.actions';

@Component({
  selector: 'image-modal',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <img style="height: 100%; width: 100%;object-fit: contain;" [src]="image">
    </ion-content>

  `,
})
export class ImageModal {
  @Input() image: string;

  constructor(private modalController: ModalController
  ) {
  }

  close() {
    this.modalController.dismiss();
  }

}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product>;
  isUserProduct$: Observable<boolean>;
  toggleExpandMap = false;
  APIENDPOINT_BACKEND;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    public alertController: AlertController
  ) {
  }

  ngOnInit(): void {
    this.APIENDPOINT_BACKEND = environment.APIENDPOINT_BACKEND;
    const queryParams = this.route.snapshot.params.id;

    this.product$ = combineLatest(
      [this.store.select(selectOneProduct(queryParams)),
              this.store.select(selectOneUserProduct(queryParams))]
    ).pipe(
      map(([one, two]) => one || two),
      tap((product) => {
        this.store.dispatch(
          PRODUCT_ACTIONS.productViewed({productId: product.id})
        );
      })
    );

    this.isUserProduct$ = this.store.pipe(select(selectUserProducts))
      .pipe(
        withLatestFrom(this.product$),
        map(([userProducts, selectedProduct]) => {
          return userProducts.some(({id}) => id === selectedProduct.id);
        })
      )


  }

  setConditionClass(condition) {
    return setConditionClass(condition);
  }

  async openDialog(image) {

    const modal = await this.modalController.create({
      component: ImageModal,
      componentProps: {image: this.APIENDPOINT_BACKEND + '/' + image}
    });
    return await modal.present();

  }

  deleteProduct() {
    this.presentAlert()
  }

 private async presentAlert() {
   const alert = await this.alertController.create({
     message: 'Desea borrar el producto?',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancel',
       }, {
         text: 'Confirmar',
         handler: () => {
           this.product$.pipe(
             take(1),
             tap((product)=>{
               this.store.dispatch(
                 USER_PRODUCT_ACTIONS.deleteUserProduct({ productId: product.id }))
             })
           ).subscribe()
         }
       }
     ]
   });

   await alert.present();
  }

  newChat() {
    this.product$.pipe(
      tap((product)=>{
        this.router.navigate(['user-menu/conversation'],{state: {sellerId: product.user.id, productId: product.id,isNewConversation:true} });
      })
    ).subscribe()
  }
}
