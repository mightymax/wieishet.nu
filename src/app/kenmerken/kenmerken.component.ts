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
  persoon?: App.Persoon
  count = DefaultKaartCount

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
    this.service.count()
      .subscribe((response: App.IQueryResponseCount) => {
        this.count = parseInt(response.results.bindings[0].count.value)
        if (this.count == 1) this.router.navigate(['/resultaat'])
      })
  }

  hasNext(): boolean {
    return this.ix < this.tuples.length
  }

  reset(): void
  {
    this.tuples.forEach(tuple => tuple.clearObject())
    this.count = DefaultKaartCount
    this.persoon?.reset()
    this.ix = 0
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
