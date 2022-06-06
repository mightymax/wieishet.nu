import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Persoon } from './app';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  persoon?: Persoon

  constructor(
    private service: AppService
  ) {}

  ngOnInit() {
    this.subscription = this.service.persoon.subscribe(
      persoon => this.persoon = persoon
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
