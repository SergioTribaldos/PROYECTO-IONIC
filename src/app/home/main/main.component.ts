import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Product } from '../product/model/product';
import { select, Store } from '@ngrx/store';
import {
  selectAllProducts,
  isLoading,
  getHasSearchFilters,
} from '../product/store/product.selector';
import { AppState } from 'src/app/reducers';
import { PRODUCT_ACTIONS } from '../product/store/product.actions';
import { takeUntil } from 'rxjs/operators';
import { CHAT_ACTIONS } from 'src/app/user-menu/chat/store/chat.actions';
import { ChatService } from '@shared/chat.service';
import {IonInfiniteScroll} from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  resultsSkipped: number;
  hasSearchFilters: boolean;



  constructor(
    private store: Store<AppState>,
    private chatService: ChatService
  ) {
    this.products$ = this.store.pipe(select(selectAllProducts));
    this.loading$ = this.store.pipe(select(isLoading));
  }
  ngOnInit(): void {
    this.chatService
      .receiveChat()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(CHAT_ACTIONS.addMessageRecieved());
      });

    this.store
      .pipe(takeUntil(this.destroy$), select(getHasSearchFilters))
      .subscribe((hasSearchFilters) => {
        this.hasSearchFilters = hasSearchFilters;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onScrollDown() {
    this.infiniteScroll.complete()
    if (!this.hasSearchFilters) {
      this.store.dispatch(PRODUCT_ACTIONS.loadMoreProducts());
    }
  }
}
