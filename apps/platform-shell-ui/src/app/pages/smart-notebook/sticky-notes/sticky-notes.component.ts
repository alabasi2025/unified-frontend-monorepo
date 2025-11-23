import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

interface StickyNote {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isDismissed: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-sticky-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DialogModule
  ],
  template: `
    <div class="sticky-notes-container">
      <div class="header">
        <div class="title-section">
          <h1><i class="pi pi-bookmark"></i> الملصقات</h1>
          <p>ملاحظات سريعة وتذكيرات مهمة</p>
        </div>
        <button pButton label="ملصق جديد" icon="pi pi-plus" (click)="showDialog = true"></button>
      </div>

      <div class="notes-board">
        <div *ngFor="let note of activeNotes" 
             class="sticky-note" 
             [style.background]="note.color"
             [style.left.px]="note.position.x"
             [style.top.px]="note.position.y"
             [style.width.px]="note.size.width"
             [style.height.px]="note.size.height">
          <div class="note-header">
            <button pButton icon="pi pi-times" class="p-button-text p-button-sm close-btn" 
                    (click)="dismissNote(note)"></button>
          </div>
          <div class="note-content">
            {{ note.content }}
          </div>
          <div class="note-footer">
            <small>{{ note.createdAt | date:'short' }}</small>
          </div>
        </div>
      </div>

      <div class="dismissed-section" *ngIf="dismissedNotes.length > 0">
        <h3><i class="pi pi-eye-slash"></i> الملصقات المخفية</h3>
        <div class="dismissed-grid">
          <p-card *ngFor="let note of dismissedNotes" [style.background]="note.color">
            <p>{{ note.content }}</p>
            <ng-template pTemplate="footer">
              <button pButton label="استعادة" icon="pi pi-replay" class="p-button-sm" 
                      (click)="restoreNote(note)"></button>
            </ng-template>
          </p-card>
        </div>
      </div>

      <p-dialog header="ملصق جديد" [(visible)]="showDialog" [modal]="true" [style]="{width: '30vw'}">
        <div class="dialog-content">
          <div class="field">
            <label>المحتوى</label>
            <textarea [(ngModel)]="newNote.content" rows="5" 
                      placeholder="اكتب ملاحظتك هنا..." style="width: 100%"></textarea>
          </div>
          <div class="field">
            <label>اللون</label>
            <select [(ngModel)]="newNote.color" style="width: 100%; padding: 0.5rem">
              <option *ngFor="let color of colors" [value]="color.value">{{ color.name }}</option>
            </select>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" icon="pi pi-times" class="p-button-text" 
                  (click)="showDialog = false"></button>
          <button pButton label="إضافة" icon="pi pi-check" (click)="addNote()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .sticky-notes-container {
      padding: 2rem;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .title-section h1 {
      margin: 0;
      color: #2c3e50;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title-section p {
      margin: 0.5rem 0 0 0;
      color: #7f8c8d;
    }

    .notes-board {
      position: relative;
      min-height: 600px;
      background: #f8f9fa;
      border-radius: 10px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .sticky-note {
      position: absolute;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      cursor: move;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .sticky-note:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .note-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.5rem;
    }

    .close-btn {
      opacity: 0.6;
    }

    .close-btn:hover {
      opacity: 1;
    }

    .note-content {
      color: #2c3e50;
      line-height: 1.6;
      margin-bottom: 1rem;
      min-height: 80px;
    }

    .note-footer {
      text-align: left;
      opacity: 0.7;
    }

    .dismissed-section {
      margin-top: 3rem;
    }

    .dismissed-section h3 {
      color: #7f8c8d;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .dismissed-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .dialog-content .field {
      margin-bottom: 1.5rem;
    }

    .dialog-content label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .dialog-content textarea {
      width: 100%;
    }

    .color-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .color-box {
      width: 30px;
      height: 30px;
      border-radius: 5px;
      border: 2px solid #ddd;
    }
  `]
})
export class StickyNotesComponent implements OnInit {
  notes: StickyNote[] = [];
  activeNotes: StickyNote[] = [];
  dismissedNotes: StickyNote[] = [];
  showDialog: boolean = false;
  
  colors = [
    { name: 'أصفر', value: '#fff59d' },
    { name: 'وردي', value: '#f8bbd0' },
    { name: 'أزرق', value: '#bbdefb' },
    { name: 'أخضر', value: '#c8e6c9' },
    { name: 'برتقالي', value: '#ffe0b2' }
  ];

  newNote: any = {
    content: '',
    color: '#fff59d'
  };

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    // TODO: استدعاء API للحصول على الملصقات
    this.notes = [
      {
        id: '1',
        content: 'لا تنسى مراجعة كود نظام الخرائط قبل نهاية اليوم',
        color: '#fff59d',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 150 },
        isDismissed: false,
        createdAt: new Date('2025-11-23')
      },
      {
        id: '2',
        content: 'اجتماع مع الفريق غداً الساعة 10 صباحاً',
        color: '#f8bbd0',
        position: { x: 300, y: 80 },
        size: { width: 200, height: 150 },
        isDismissed: false,
        createdAt: new Date('2025-11-23')
      }
    ];
    this.filterNotes();
  }

  filterNotes() {
    this.activeNotes = this.notes.filter(n => !n.isDismissed);
    this.dismissedNotes = this.notes.filter(n => n.isDismissed);
  }

  dismissNote(note: StickyNote) {
    note.isDismissed = true;
    this.filterNotes();
    // TODO: استدعاء API لتحديث الحالة
  }

  restoreNote(note: StickyNote) {
    note.isDismissed = false;
    this.filterNotes();
    // TODO: استدعاء API لتحديث الحالة
  }

  addNote() {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      content: this.newNote.content,
      color: this.newNote.color,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      size: { width: 200, height: 150 },
      isDismissed: false,
      createdAt: new Date()
    };
    this.notes.push(newNote);
    this.filterNotes();
    this.showDialog = false;
    this.newNote = { content: '', color: '#fff59d' };
    // TODO: استدعاء API لحفظ الملصق
  }
}
