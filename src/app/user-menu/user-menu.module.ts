import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu.component';
import { UserProductsComponent } from './user-products/user-products.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@shared/material/material.module';
import { ChatComponent } from './chat/chat.component';
import {IonicModule} from '@ionic/angular';
import {ConversationComponent} from './chat/conversation/conversation.component';

const routes: Routes = [
  {
    path: '',
    component: UserMenuComponent,
    children: [
      {
        path: 'user-products',
        component: UserProductsComponent,
      },
      {
        path: 'chat',
        component: ChatComponent,
      },
      {
        path: 'conversation',
        component: ConversationComponent,
      },
      {
        path: '**',
        component: UserProductsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [UserMenuComponent, UserProductsComponent, ChatComponent,ConversationComponent],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        MaterialModule,
        RouterModule.forChild(routes),
        IonicModule,
    ],
})
export class UserMenuModule {}
