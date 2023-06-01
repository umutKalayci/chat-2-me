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
          import('../pages/discover/discover.module').then(
            (m) => m.DiscoverPageModule
          ),
      },
      {
        path: 'chats',
        loadChildren: () =>
          import('../pages/chats/chats.module').then((m) => m.ChatsPageModule),
      },
      {
        path: 'chats/:id',
        loadChildren: () =>
          import('../pages/chats/chat/chat.module').then(
            (m) => m.ChatPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../pages/settings/settings.module').then(
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
