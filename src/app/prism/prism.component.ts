import { Component, ContentChild, ElementRef, Input, TemplateRef } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-turtle'
import 'prismjs/components/prism-sparql'

@Component({
  selector: 'prism',
  templateUrl: './prism.component.html',
  styleUrls: ['./prism.component.scss']
})
export class PrismComponent {
  @Input() language: string = "turtle";
  @Input() source: string = ""

  hl() {
    return Prism.highlight(this.source, Prism.languages[this.language], this.language);
  }

}
