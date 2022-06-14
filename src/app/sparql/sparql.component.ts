import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare var yasgui: any;

@Component({
  selector: 'app-sparql',
  templateUrl: './sparql.component.html',
  styleUrls: ['./sparql.component.scss']
})
export class SparqlComponent implements OnInit, AfterViewInit {

  constructor() {

  }
  ngAfterViewInit(): void {
   
  }

  ngOnInit(): void {
    new yasgui(environment.sparqlEndpoint)
    document.body.classList.add('sparql')
    document.body.classList.add('step')
  }

}
