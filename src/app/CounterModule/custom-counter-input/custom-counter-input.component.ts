import { Component, OnInit } from '@angular/core';
import { CounterState } from '../state/counter.state';
import { Store } from '@ngrx/store';
import { changeTopic, customIncrement } from '../state/counter.actions';
import { getTopicName } from '../state/counter.selector';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-custom-counter-input',
  templateUrl: './custom-counter-input.component.html',
  styleUrls: ['./custom-counter-input.component.css']
})
export class CustomCounterInputComponent implements OnInit {

  value: any;
  topic$: Observable<string> | undefined; 
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.topic$ = this.store.select(getTopicName);
  }

  onAdd() {
    this.store.dispatch(customIncrement({ count: this.value }));
  }

  onChangeTopic() {
    this.store.dispatch(changeTopic());
  }

}
