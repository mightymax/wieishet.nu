import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AppService } from '../app.service';
import { IKaart } from '../resultaat/resultaat.component';
import * as App from '../app'

@Component({
  selector: 'app-personen',
  templateUrl: './personen.component.html',
  styleUrls: ['./personen.component.scss']
})
export class PersonenComponent implements OnInit {

  givenName: string | undefined
  kaart?: IKaart
  loading = true
  resultMode: "kaart" | "rdf" = "kaart"
  rdf: string = "";
  error = ""
  kleurKaart = ""

  constructor(
    public service: AppService,
    private route:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    document.body.classList.add('step')

    this.givenName = this.route.snapshot.params['givenName'];
    this.kleurKaart = this.route.snapshot.params['kleur'];
    if (!this.givenName || !this.givenName.match(/^[A-Z][a-z]{1,6}$/)) {
      this.error = "geen of verkeerde naam opgegeven"
      return
    }
    const query = `
SELECT * WHERE {
  ?persoon a <${App.NS.iri}Persoon>;
      <https://schema.org/image> ?afbeelding ;
      <https://schema.org/givenName> ?voornaam .
      FILTER(?voornaam = "${this.givenName}")
} LIMIT 1`
    this.service.fetch(query)
      .subscribe((response: App.IQueryResponse) => {
        const sparqlResult = { ...response }
        this.loading = false
        if (sparqlResult.results.bindings.length == 1) {
          const img=new App.Imageresolver();
          img.setSrc(sparqlResult.results.bindings[0].afbeelding.value)
          img.onload = () => {
            this.kaart = {
              voornaam: sparqlResult.results.bindings[0].voornaam.value,
              afbeelding: img.src,
              kleur: "#0066cc"
            }
          }

          App.Persoon.rdf(sparqlResult.results.bindings[0].voornaam.value)
            .then(rdf => {
              if (rdf) {
                this.rdf = rdf
              }
            })
        }
      })
  }
}
