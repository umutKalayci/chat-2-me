import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscoverPage } from './disover.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { DiscoverPageRoutingModule } from './discover-routing.module';
import { register } from 'swiper/element/bundle';
register();
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DiscoverPageRoutingModule,
  ],
  declarations: [DiscoverPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiscoverPageModule {}
