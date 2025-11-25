import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { NotebooksListComponent } from './components/notebooks-list/notebooks-list.component';

// Services
import { NotebookService } from './services/notebook.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notebooks',
    pathMatch: 'full'
  },
  {
    path: 'notebooks',
    component: NotebooksListComponent
  }
];

@NgModule({
  declarations: [
    NotebooksListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    NotebookService
  ]
})
export class SmartNotebookModule { }
