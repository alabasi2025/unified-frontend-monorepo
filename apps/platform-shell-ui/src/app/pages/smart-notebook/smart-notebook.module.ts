import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { NotebooksListComponent } from './components/notebooks-list/notebooks-list.component';
import { NotebookDetailComponent } from './components/notebook-detail/notebook-detail.component';
import { SectionViewComponent } from './components/section-view/section-view.component';
import { PageEditorComponent } from './components/page-editor/page-editor.component';
import { NotebookTreeComponent } from './components/notebook-tree/notebook-tree.component';

// Services
import { NotebookService } from './services/notebook.service';
import { SectionService } from './services/section.service';
import { PageService } from './services/page.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'notebooks',
    pathMatch: 'full'
  },
  {
    path: 'notebooks',
    component: NotebooksListComponent
  },
  {
    path: 'notebooks/:id',
    component: NotebookDetailComponent
  },
  {
    path: 'notebooks/:notebookId/sections/:sectionId',
    component: SectionViewComponent
  },
  {
    path: 'notebooks/:notebookId/sections/:sectionId/pages/:pageId',
    component: PageEditorComponent
  }
];

@NgModule({
  declarations: [
    NotebooksListComponent,
    NotebookDetailComponent,
    SectionViewComponent,
    PageEditorComponent,
    NotebookTreeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    NotebookService,
    SectionService,
    PageService
  ]
})
export class SmartNotebookModule { }
