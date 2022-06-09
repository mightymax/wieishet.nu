import { environment } from 'src/environments/environment';

export const NS = {
  iri: "https://wieishet.nu/ontologie#",
  prefix: "wie:",
  
}

export type predicate = "kleurogen" | "kleurhaar" | "geslacht"| "bril" | "gezichtsbeharing" | "hoofdbedekking" | "kleurkaart"

interface IObject {
  label: string;
  iri?: string | null
  getIri(withPrefix: boolean): string
}

interface ITuple {
  predicate: predicate ;
  question: string ;
  object?: Object
  objects: Object[],
}

export class Object implements IObject
{
  label: string
  iri?: string | null = null

  constructor(label: string, iri: string | null = null) {
    this.label = label
    if (iri) this.iri = iri
  }

  public getIri(withPrefix: boolean = true): string {
    if (this.iri && (this.iri == 'true' || this.iri == 'false')) return this.iri
    const iri = this.iri ? this.iri : this.label
    return withPrefix ? `${this.prefix()}${iri}` : iri
  }

  protected prefix(): string {
    return NS.prefix
  }

  public setIri(iri: string): void
  {
    this.iri = iri
  }

}

type TupleMap = Map<predicate, Tuple>;

interface IPersoon {
  tuples:  TupleMap ;
  getIri(withPrefix: boolean): string;
  setTuple(tuple: Tuple): void
  hasTuple(tuple: Tuple): boolean
}

export class Persoon implements IPersoon
{
  tuples: TupleMap = new Map()

  reset(): void {
    this.tuples  = new Map()
  }

  getIri(withPrefix: boolean = true): string
  {
    return (withPrefix ? NS.prefix : '') + 'Persoon'
  }

  setTuple(tuple: Tuple): void {
    this.tuples.set(tuple.predicate, tuple)
  }

  deleteTuple(tuple: Tuple): void {
    this.tuples.delete(tuple.predicate)
  }

  hasTuple(tuple: Tuple): boolean {
    return this.tuples.has(tuple.predicate);
  }

  getTupleByPredicate(predicate: predicate): Tuple | undefined {
    if (this.tuples.has(predicate)) {
      return this.tuples.get(predicate)
    } else {
      return
    }
  }

  tuplesAsArray(): Tuple[] {
    const tuples: Tuple[] = []
    this.tuples.forEach(tuple => {
      if (tuple.object) tuples.push(tuple)
    })
    return tuples;
  }

  kleurKaart(): string | undefined
  {
    const tuple = this.getTupleByPredicate("kleurkaart")
    return tuple?.object?.label
  }

  countQuery(): string
  {
    let where = this.getWhere();
    if (0 == where.length) where = [`a ${this.getIri()}`]
    return `
PREFIX ${NS.prefix} <${NS.iri}>
SELECT (COUNT(*) AS ?count) WHERE {
  ?persoon ${where.join("  ")} .
}`
  }

  private getWhere(): string[] {
    let where: string[] = []
    this.tuples.forEach(
      tuple => {
        if (tuple.predicate != 'kleurkaart')
          where.push(`${tuple.getPredicate(true)} ${tuple!.getObject(true)} ;`)
      }
    )
    return where
  }

  static async rdf(voornaam: string): Promise<string | void >
  {
    try {
      const response = await fetch(`/assets/personen/${voornaam}.ttl`);
      return await response.text();
    } catch {
      return alert("Kan rdf niet ophalen.");
    }
  }

  sparql(): string
  {
    let where = this.getWhere().length ? ` ;\n    ` + this.getWhere().join("\n    "): ""

    let rq = `
PREFIX ${NS.prefix} <${NS.iri}>
PREFIX schema: <https://schema.org/> 

SELECT * WHERE {
  ?persoon a ${this.getIri()}${where} .
  ?persoon schema:givenName ?voornaam; 
    schema:image ?afbeelding .
} `
    return rq;
  }
}

export class Tuple implements ITuple
{
  predicate: predicate
  question: string = "";
  objects: Object[] = []
  object?: Object

  constructor(predicate: predicate) {
    this.predicate = predicate
    this.init()
  }

  getPredicate(withPrefix: boolean = true):string {
    return withPrefix ? NS.prefix + this.predicate : this.predicate
  }

  getObject(withPrefix: boolean = true):string | undefined {
    return this.object?.getIri(withPrefix)
  }

  init(): void {}

  setQuestion(question: string): this 
  {
    this.question = question
    return this
  }

  addObjects(labels: string[]): this {
    labels.forEach(label => this.addObject(label));
    return this;
  }

  getObjectByLabel(label: string): Object | null
  {
    var foundObj: Object | null = null
    this.objects.forEach(obj => {
      if (obj.label == label) {
        foundObj = obj
      };
    });
    return foundObj
  }

  addObject(obj: Object | string): this
  {
    if (obj instanceof Object) this.objects.push(obj)
    else this.objects.push(new Object(obj))
    return this
  }

  hasObject(): boolean {
    return this.object != null
  }

  setObject(obj: Object): this 
  {
    this.object = obj
    return this
  }

  clearObject(): this 
  {
    this.object = undefined
    return this
  }

}

class BooleanTuple extends Tuple {
  
  override init():void {
    this
      .addObject(new Object("Ja", "true"))
      .addObject(new Object("Nee", "false"))
  }

  override getObject(withPrefix?: boolean): string | undefined
  {
    return super.getObject(false)
  }
}

export const Geslacht = (new Tuple("geslacht"))
  .addObjects(["Man", "Vrouw"])
  .setQuestion("Geslacht");


export const KleurOgen = (new Tuple("kleurogen"))
  .setQuestion("Kleur ogen")
  .addObjects(["Blauw", "Bruin", "Groen"]) ;


export const Bril = (new BooleanTuple("bril"))
  .setQuestion("Bril")

export const Hoofdbedekking = (new BooleanTuple("hoofdbedekking"))
  .setQuestion("Hoofdbedekking")

export const Gezichtsbeharing = (new BooleanTuple("gezichtsbeharing"))
  .setQuestion("Gezichtsbeharing")

export const KleurKaart = (new Tuple("kleurkaart"))
  .setQuestion("Kleur kaart")
  .addObjects(["Rood", "Geel", "Blauw"])

export const KleurHaren = (new Tuple("kleurhaar"))
  .setQuestion("Kleur haren")
  .addObjects(["Blond", "Zwart", "Geverfd/Gemixt", "Bruin", "Rood", "Kaal", "Grijs/Wit"])
  // .addObjects(["Blond", "Zwart", "Bruin"])

KleurHaren.getObjectByLabel("Geverfd/Gemixt")?.setIri("Geverfd")
KleurHaren.getObjectByLabel("Grijs/Wit")?.setIri("GrijsWit")

export interface IQueryResponse {
  head: {
    vars: [
      "persoon",
      "voornaam",
      "afbeelding"
    ]
  }
  results: {
    bindings: 
      {
        persoon: {
          type: "url",
          value: string
        },

        voornaam: {
          type: "literal",
          value: string
        },

        afbeelding: {
          type: "uri",
          value: string
        }
      }[]
  }
}


export interface IQueryResponseCount
{
  head: {
    vars: [
      "count",
    ]
  }
  results: {
    bindings: 
      {
        count: {
          datatype: "http://www.w3.org/2001/XMLSchema#integer",
          value: string
        }
      }[]
  }
}

export class Imageresolver extends Image
{
  setSrc(src: string) {
    if (src.match(/^.+\/[A-Z][a-z]{1,5}\.jpg$/)) {
      this.src = src.replace(/^.+\/([A-Z][a-z]{1,5}\.jpg)$/, `${environment.basePathKaartImages}/$1`)
    } else {
      this.src = src
    }
  }

}
