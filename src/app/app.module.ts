import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { KenmerkenComponent } from './kenmerken/kenmerken.component';
import { StartComponent } from './start/start.component';
import { ResultaatComponent } from './resultaat/resultaat.component';
import { HttpClientModule } from '@angular/common/http';
import { PrismComponent } from './prism/prism.component';
import { SparqlComponent } from './sparql/sparql.component';
import { PersonenComponent } from './personen/personen.component';
import { OntologieComponent } from './ontologie/ontologie.component';
import { SpelComponent } from './spel/spel.component';

@NgModule({
  declarations: [
    AppComponent,
    KenmerkenComponent,
    StartComponent,
    ResultaatComponent,
    PrismComponent,
    SparqlComponent,
    PersonenComponent,
    OntologieComponent,
    SpelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
