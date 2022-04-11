import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { BuscaAcordeComponent } from './busca-acorde/busca-acorde.component';
import { PoolComponent } from './pool/pool.component';
import { MostradorComponent } from './mostrador/mostrador.component'

@NgModule({
  declarations: [
    AppComponent,
    BuscaAcordeComponent,
    PoolComponent,
    MostradorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }