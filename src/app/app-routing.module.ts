import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscaAcordeComponent } from './busca-acorde/busca-acorde.component';
import { CriadorComponent } from './criador/criador.component';
import { MostradorComponent } from './mostrador/mostrador.component';

const routes: Routes = [
  {path:"", component: MostradorComponent},
  {path:"buscador", component: BuscaAcordeComponent},
  {path:"criador", component: CriadorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
