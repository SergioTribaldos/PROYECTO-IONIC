import {Component, OnInit, Inject, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, combineLatest} from 'rxjs';
import {AppState} from 'src/app/reducers';
import {ActivatedRoute} from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {environment} from 'src/environments/environment';
import {map, tap} from 'rxjs/operators';
import {Product} from 'src/app/home/product/model/product';
import {selectOneProduct} from 'src/app/home/product/store/product.selector';
import {PRODUCT_ACTIONS} from 'src/app/home/product/store/product.actions';
import {setConditionClass} from 'src/app/home/product/constants/functions';
import {selectOneUserProduct} from 'src/app/user-menu/store/user-product.selectors';
import {ModalController} from '@ionic/angular';

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
  toggleExpandMap = false;
  APIENDPOINT_BACKEND;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) {
  }

  ngOnInit(): void {
    this.APIENDPOINT_BACKEND = environment.APIENDPOINT_BACKEND;
    const queryParams = this.route.snapshot.params.id;

    this.product$ = combineLatest(
      this.store.select(selectOneProduct(queryParams)),
      this.store.select(selectOneUserProduct(queryParams))
    ).pipe(
      map(([one, two]) => one || two),
      tap((product) => {
        this.store.dispatch(
          PRODUCT_ACTIONS.productViewed({productId: product.id})
        );
      })
    );
  }

  setConditionClass(condition) {
    return setConditionClass(condition);
  }

  async openDialog(image) {
    /* this.dialog.open(DialogOverviewExampleDialog, {
       data: this.APIENDPOINT_BACKEND + '/' + image,
     });*/

    const modal = await this.modalController.create({
      component: ImageModal,
      componentProps: {image: this.APIENDPOINT_BACKEND + '/' + image}
    });
    return await modal.present();

  }

  /*expandMap();
  {
    this.toggleExpandMap = !this.toggleExpandMap;
  }*/
}
