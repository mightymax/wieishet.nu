import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import * as App  from '../app';
import { ActivatedRoute, Router } from '@angular/router';

const DefaultKaartCount = 20

@Component({
  selector: 'app-kenmerken',
  templateUrl: './kenmerken.component.html',
  styleUrls: ['./kenmerken.component.scss']
})
export class KenmerkenComponent implements OnInit, OnDestroy {
  
  subscription!: Subscription;
  persoon: App.Persoon = new App.Persoon()
  count = DefaultKaartCount
  results: any | undefined

  ns = App.NS

  tuples = [
    App.KleurKaart,
    App.Geslacht,
    App.KleurHaren,
    App.KleurOgen ,
    App.Bril,
    App.Hoofdbedekking,
    App.Gezichtsbeharing,
  ]
  tuple!: App.Tuple
  ix: number = -1

  constructor(
    public service: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.next()
  }

  setObject(obj: App.Object): void 
  {
    this.tuple.object = obj
    this.persoon?.setTuple(this.tuple)
    this.updateCount()
    this.next()
  }

  updateCount()
  {
    this.service.fetch(this.persoon!.sparql())
      .subscribe((response: App.IQueryResponse) => {
        this.results = response.results.bindings
        this.count = response.results.bindings.length
      });
  }

  goto(naam: string)
  {
    if(!this.kleurKaart()) {
      alert('Je moet de kleur van de kaart nog raden!')
    } else {
      this.router.navigate([`/personen/${naam}/kleur/${this.kleurKaart()}`]);
    }
  }

  kleurKaart() {
    let kleur: string | undefined = ""
    this.tuples.forEach(tuple => {
      if(tuple.getPredicate(false) == 'kleurkaart' && tuple.hasObject()) {
        kleur = tuple.getObject(false)
      }
    });
    return kleur ? kleur : ""
  }

  rdf(): string {
    if (this.persoon?.tuples.size == 0) return ""
    let rdf: string[] = []
    this.persoon?.tuples.forEach(tuple => {
      rdf.push(`${tuple.getPredicate()} ${tuple.getObject()} ;`)
    });
    let firstTriple = `${this.persoon?.getIri()} ${rdf.shift()?.trim()}`
    if (rdf.length) {
      let lastTriple = `\n   ${rdf.pop()?.replace(/ \;$/, '')}`
      let othertriples = rdf.length ? `\n   ${rdf.join("\n   ")}` : ""
      return `${firstTriple}${othertriples}${lastTriple} .`
    } else {
      return firstTriple?.replace(/ \;$/, '') + ' .'
    }
  }

  hasNext(): boolean {
    return this.ix < this.tuples.length
  }

  reset(): void
  {
    this.tuples.forEach(tuple => tuple.clearObject())
    this.count = DefaultKaartCount
    this.persoon?.reset()
    this.ix = -1
    this.next()
  }

  next(): void {
    this.ix++
    if (this.hasNext()) this.tuple = this.tuples[this.ix]
  }

  ngOnInit(): void {
    document.body.classList.add('step')
    this.subscription = this.service.persoon.subscribe(
      persoon => {
        this.persoon = persoon
      }
    )

    if (this.route.snapshot.params['predicate'] == 'opnieuw') {
      return this.reset()
    }

    this.updateCount()

  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
