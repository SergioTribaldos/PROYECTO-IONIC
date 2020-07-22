import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../shared/chat.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { getUserId } from 'src/app/auth/store/auth.selectors';
import { take, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { selectOneProduct } from 'src/app/home/product/store/product.selector';
import { Product } from 'src/app/home/product/model/product';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { MessageDto, NewConversationDto, ConversationMessage } from './types';
import { ProductMiniature } from '../types/types';
import { CHAT_ACTIONS } from './store/chat.actions';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  newConversation$: Observable<Product>;
  serverConversations$: Observable<ProductMiniature[]>;
  conversationMessages: ConversationMessage[] = [];
  userId: string;



  APIENDPOINT_BACKEND = environment.APIENDPOINT_BACKEND;

  @ViewChild('container') messagesContainer: ElementRef;


  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router:Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(CHAT_ACTIONS.resetMessagesRecieved());


    this.store.pipe(select(getUserId), take(1)).subscribe((id) => {
      this.userId = id;
    });

    if (!!this.route.snapshot.queryParams) {
      this.startNewConversation();
    }

    this.serverConversations$ = this.messageService.getConversations(
      this.userId
    );
  }



  startNewConversation() {
    const { productId } = this.route.snapshot.queryParams;
    this.newConversation$ = this.store.pipe(
      select(selectOneProduct(productId))
    );
  }

  selectInboxConversation(product: ProductMiniature) {
   const selectedChat= {
      conversationId: product.conversationId,
        recieverId:
      product.buyerId === this.userId ? product.sellerId : product.buyerId,
        senderId: this.userId,
    }

    this.router.navigate(['user-menu/conversation'],{state: {product:product,selectedChat:selectedChat,isNewConversation:false} });
  }

  scrollBottom() {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = Math.max(
        0,
        this.messagesContainer.nativeElement.scrollHeight -
          this.messagesContainer.nativeElement.offsetHeight
      );
    }, 10);
  }
}
