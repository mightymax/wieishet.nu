import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as App from '../app'
import { AppService } from '../app.service';
import {Router} from "@angular/router"

export interface IKaart {
  voornaam: string,
  afbeelding: string,
  kleur: string
}

@Component({
  selector: 'app-resultaat',
  templateUrl: './resultaat.component.html',
  styleUrls: ['./resultaat.component.scss']
})
export class ResultaatComponent implements OnInit {
  ns = App.NS
  subscription!: Subscription;
  persoon?: App.Persoon
  kaart?: IKaart
  error?: string
  rdf: string = ""

  resultMode: "kaart" | "sparql" | "rdf" = "kaart"

  constructor(
    public service: AppService,
    private router: Router
  ) { 
  }

  mode(mode: "kaart" | "sparql" | "rdf") 
  {
    this.resultMode = mode
  }

  restart() {
    this.persoon!.reset()
    this.router.navigate(['/kenmerken/opnieuw'])
  }

  ngOnInit(): void {
    this.subscription = this.service.persoon.subscribe(
      persoon => {
        this.persoon = persoon
      }
    )
    if (0 == this.persoon?.tuples.size) {
      this.router.navigate(['/kenmerken'])
      return
    }
    this.service.fetch()
      .subscribe((response: App.IQueryResponse) => {
        const sparqlResult = { ...response }
        if (sparqlResult.results.bindings.length > 1) {
          let namen: string[] = []
          sparqlResult.results.bindings.forEach(binding => namen.push(binding.voornaam.value))
          let naam = namen.pop()
          this.error = `
            <p>
              Er lijkt iets niets goed gegaan:
              <br>er zijn ${sparqlResult.results.bindings.length} kaarten gevonden die aan jouw kenmerken voldoen
              <br>terwijl er maar 1 kaart verwacht wordt.
            </p>
            <p>We vonden de kaarten van ${namen.join(', ')} &amp; ${naam}.</p>
          
          ` ;
        } else {
          const img=new Image();
          img.src=sparqlResult.results.bindings[0].afbeelding.value;
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
      });
  }
}
