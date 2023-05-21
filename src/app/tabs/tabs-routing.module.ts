import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'pages',
    component: TabsPage,
    children: [
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
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/pages/disover',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/pages/disover',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
