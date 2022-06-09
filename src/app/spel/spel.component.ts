import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as App  from '../app';
import { AppService } from '../app.service';

@Component({
  selector: 'app-spel',
  templateUrl: './spel.component.html',
  styleUrls: ['./spel.component.scss']
})
export class SpelComponent implements OnInit {

  persoon: App.Persoon = new App.Persoon()

  constructor(
    public service: AppService,
    private router: Router
  ) { 
  }

  tuples = [
    App.KleurKaart,
    App.Geslacht,
    App.KleurHaren,
    App.KleurOgen ,
    App.Bril,
    App.Hoofdbedekking,
    App.Gezichtsbeharing,
  ]

  guesses: number = 0;
  results: any | undefined

  guessedTuples: Map<App.Tuple, App.Object> = new Map<App.Tuple, App.Object>()
  guessedObjects: Map<App.Object, boolean> = new Map<App.Object, boolean>()

  tuple: App.Tuple | undefined

  randomKaart: Map<string, string> = new Map()
  givenName: string = ""

  answer(obj: App.Object): void {
    if (this.guessed(obj)) return;
    this.guesses++;
    if (this.tuple) {
      const predicate = this.tuple.predicate
      const object = obj.getIri(false)
      
      if (this.randomKaart.has(predicate) && this.randomKaart.get(predicate) == object) {
        this.tuple.setObject(obj)
        this.persoon.setTuple(this.tuple)
        this.guessedTuples.set(this.tuple, obj)
        this.guessedObjects.set(obj, true)
        // This forces the user to return to choices after a correct guess:
        // this.tuple = undefined
      } else {
        this.guessedObjects.set(obj, false)
        this.persoon.deleteTuple(this.tuple)
        this.tuple.clearObject()
        this.guessedTuples.delete(this.tuple)
      }
    } else {
      this.guessedObjects.set(obj, false)
    }
    this.updateCount()
  }

  goto(naam: string)
  {
    if(!this.kleurKaart()) {
      alert('Je moet de kleur van de kaart nog raden!')
    } else {
      if (naam !== this.givenName) {
        alert(`Helaas, ${naam} is niet de persoon die ik in gedachten heb.`)
        this.guesses++
      } else {
        this.router.navigate([`/personen/${naam}/kleur/${this.kleurKaart()}`]);
      }
    }
  }

  guessedRight2() : boolean
  {
    return this.guessedTuples.has(App.KleurKaart) && this.results?.length == 1 && this.results[0].voornaam.value == this.givenName
  }

  kleurKaart(): string {
    if (this.guessedTuples.has(App.KleurKaart)) {
      return this.guessedTuples.get(App.KleurKaart)!.label
    } else {
      return ""
    }
  }

  updateCount()
  {
    this.service.fetch(this.persoon.sparql())
      .subscribe((response: App.IQueryResponse) => {
        this.results = response.results.bindings
      });
  }
  guessed(obj: App.Object): boolean {
    return this.guessedObjects.has(obj)
  }

  guessedRight(obj: App.Object): boolean {
    return this.guessed(obj) && this.guessedObjects.get(obj) == true
  }

  private randomKleur() {
    const kleuren = ["Geel", "Blauw", "Rood"]
    const ix = Math.floor(Math.random() * kleuren.length);
    return kleuren[ix]
  }

  ngOnInit(): void {
    this.randomKaart.set('kleurkaart', this.randomKleur())

    //Fetch a Random Person
    // Warning: happy coding with lots of 'any' is in place ;-)
    this.service.fetch("SELECT ?p WHERE { ?p a <https://wieishet.nu/ontologie#Persoon> } LIMIT 20")
      .subscribe((response: any) => {
        let randomIx = Math.floor(Math.random() * response.results.bindings.length)
        const persoon: string = response.results.bindings[randomIx].p.value
        this.service.fetch(`SELECT * WHERE {<${persoon}> ?pred ?obj}`)
          .subscribe((response: any) => {
            response.results.bindings.forEach((binding: any) => {
              if (binding.pred.value.indexOf("https://wieishet.nu/ontologie#") == 0) {
                const pred: string = binding.pred.value.replace("https://wieishet.nu/ontologie#", "")
                const obj: string = binding.obj.value.replace("https://wieishet.nu/ontologie#", "")
                this.randomKaart.set(pred, obj)
              } else if (binding.pred.value == 'https://schema.org/givenName') {
                this.givenName = binding.obj.value
              }
            })
          })
      });
    document.body.classList.add('step')
    this.updateCount()
  }

  setTuple(ix: number)
  {
    this.guessedObjects = new Map<App.Object, boolean>()
    this.tuple = this.tuples[ix]
  }

  restart() {
    this.randomKaart = new Map()
    this.guesses = 0;
    this.results = undefined
    this.guessedTuples = new Map<App.Tuple, App.Object>()
    this.guessedObjects = new Map<App.Object, boolean>()
    this.tuple = undefined
    this.ngOnInit()
  }

  img(src: string): App.Imageresolver {
    let img = new App.Imageresolver()
    img.setSrc(src);
    return img
  }
}
