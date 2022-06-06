import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { KenmerkenComponent } from './kenmerken/kenmerken.component';
import { OntologieComponent } from './ontologie/ontologie.component';
import { PersonenComponent } from './personen/personen.component';
import { ResultaatComponent } from './resultaat/resultaat.component';
import { SparqlComponent } from './sparql/sparql.component';
import { SpelComponent } from './spel/spel.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {path: '', component: StartComponent} ,
  {path: 'start', component: StartComponent} ,
  {path: 'kenmerken', component: KenmerkenComponent} ,
  {path: 'kenmerken/:predicate', component: KenmerkenComponent} ,
  {path: 'personen/:givenName', component: PersonenComponent} ,
  {path: 'personen/:givenName/kleur/:kleur', component: PersonenComponent} ,
  {path: 'resultaat', component: ResultaatComponent} ,
  {path: 'sparql', component: SparqlComponent} ,
  {path: 'ontologie', component: OntologieComponent} ,
  {path: 'spel', component: SpelComponent} ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
