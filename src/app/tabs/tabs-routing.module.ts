import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/pages/disover',
        pathMatch: 'full',
      },
      {
        path: 'disover',
        loadChildren: () =>
          import('../discover/discover.module').then(
            (m) => m.DiscoverPageModule
          ),
      },
      {
        path: 'chats',
        loadChildren: () =>
          import('../chats/chats.module').then((m) => m.ChatsPageModule),
      },
      {
        path: 'chats/:id',
        loadChildren: () =>
          import('../chat/chat.module').then((m) => m.ChatPageModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
