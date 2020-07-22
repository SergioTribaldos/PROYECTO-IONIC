import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from '@shared/chat.service';
import {MessageService} from '../message.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../reducers';
import { take} from 'rxjs/operators';
import {ConversationMessage, MessageDto, NewConversationDto} from '../types';
import {getUserId} from '../../../auth/store/auth.selectors';
import {IonInput} from '@ionic/angular';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit {
  @ViewChild('messageInput') messageInput: IonInput;
  conversationMessages: ConversationMessage[] = [];
  selectedProduct: any;
  userId: string;
  newConversationSelected: boolean;
  newConversationData: NewConversationDto;
  selectedChat: MessageDto;
  routerParams:any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private chatService: ChatService,
              private messageService: MessageService,
              private store: Store<AppState>) {
  }

  ngOnInit() {
   this.routerParams=this.router.getCurrentNavigation().extras.state

    if(!this.routerParams.isNewConversation){
      this.selectedProduct = this.routerParams.product;
      this.selectedChat = this.routerParams.selectedChat;
      this.messageService.getMessages(this.routerParams.product.conversationId).subscribe(
        (messages)=>{this.conversationMessages = messages;}
      )
    }

    this.store.pipe(select(getUserId), take(1)).subscribe((id) => {
      this.userId = id;
    });


    this.chatService.receiveChat().subscribe((message) => {
      if (message.conversationId === this.selectedChat.conversationId) {
        this.conversationMessages.push(message);
      }
    });

  }

  sendMessage(message) {
    if(!message){
      return null;
    }
    this.messageInput.value = '';
    this.routerParams.isNewConversation
      ? this.sendFirstMessage(message)
      : this.sendOneMessage(message);
  }

  sendFirstMessage(message: string) {
    this.newConversationSelected = false;
    const {productId, sellerId} = this.routerParams
    this.newConversationData = {
      productId,
      sellerId,
      buyerId: this.userId,
      message,
    };

    this.messageService
      .sendFirstMessage(this.newConversationData)
      .subscribe((conversationId) => {
        this.selectedChat = {
          senderId: this.userId,
          recieverId: this.userId === sellerId ? 0 : sellerId,
          conversationId,
        };
        this.conversationMessages.push({...this.selectedChat, message});
      });
  }

  sendOneMessage(message: string) {
    this.chatService.sendMessage({...this.selectedChat, message});
    this.conversationMessages.push({...this.selectedChat, message});
  }

}
