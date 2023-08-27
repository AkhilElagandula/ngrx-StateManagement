import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router"
import { CounterComponent } from "./counter/counter.component";
import { StoreModule } from "@ngrx/store";
import { counterReducer } from "./state/counter.reducer";

const routes: Routes = [
    {
        path: '',
        component: CounterComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CounterRoutingModule { }