import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscoverPage } from './disover.page';
import { DiscoverPageRoutingModule } from './discover-routing.module';
import { register } from 'swiper/element/bundle';
import { MatchBoxComponent } from '../components/match-box/match-box.component';
register();
@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, DiscoverPageRoutingModule],
  declarations: [DiscoverPage, MatchBoxComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiscoverPageModule {}
