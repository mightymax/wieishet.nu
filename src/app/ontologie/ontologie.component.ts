import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ontologie',
  templateUrl: './ontologie.component.html',
  styleUrls: ['./ontologie.component.scss']
})
export class OntologieComponent implements OnInit {

  rdf: string = ""

  constructor() {}

  ngOnInit(): void {
    document.body.classList.add('sparql')
    fetch(`/ontologie/wieishet.ttl`)
      .then(response => response.text())
      .then(txt => this.rdf = txt)
      .catch(() => alert("Kan ontologie niet ophalen."))
  }

}
