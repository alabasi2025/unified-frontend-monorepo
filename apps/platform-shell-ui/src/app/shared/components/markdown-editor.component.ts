import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ],
  template: `
    <div class="markdown-editor">
      <div class="editor-toolbar">
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('**', '**')" title="غامق">
          <strong>B</strong>
        </button>
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('*', '*')" title="مائل">
          <em>I</em>
        </button>
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('# ', '')" title="عنوان">
          H1
        </button>
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('## ', '')" title="عنوان فرعي">
          H2
        </button>
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('- ', '')" title="قائمة">
          • List
        </button>
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('[', '](url)')" title="رابط">
          🔗
        </button>
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('![alt](', ')')" title="صورة">
          🖼️
        </button>
        <button type="button" class="toolbar-btn" (click)="insertMarkdown('```\n', '\n```')" title="كود">
          &lt;/&gt;
        </button>
        <div class="toolbar-divider"></div>
        <button 
          type="button" 
          class="toolbar-btn" 
          [class.active]="viewMode === 'edit'"
          (click)="viewMode = 'edit'"
          title="محرر"
        >
          ✏️ محرر
        </button>
        <button 
          type="button" 
          class="toolbar-btn" 
          [class.active]="viewMode === 'split'"
          (click)="viewMode = 'split'"
          title="مقسم"
        >
          ⚡ مقسم
        </button>
        <button 
          type="button" 
          class="toolbar-btn" 
          [class.active]="viewMode === 'preview'"
          (click)="viewMode = 'preview'"
          title="معاينة"
        >
          👁️ معاينة
        </button>
      </div>

      <div class="editor-content" [class.split]="viewMode === 'split'">
        <div class="editor-pane" *ngIf="viewMode !== 'preview'">
          <textarea
            #textarea
            [(ngModel)]="value"
            (ngModelChange)="onChange($event)"
            (blur)="onTouched()"
            [style.height.px]="height"
            class="editor-textarea"
            placeholder="اكتب محتوى Markdown هنا..."
          ></textarea>
        </div>

        <div class="preview-pane" *ngIf="viewMode !== 'edit'">
          <div class="markdown-preview" [style.height.px]="height">
            <markdown [data]="value || '*لا يوجد محتوى للمعاينة*'"></markdown>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .markdown-editor {
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }

    .editor-toolbar {
      display: flex;
      gap: 0.25rem;
      padding: 0.5rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      flex-wrap: wrap;
    }

    .toolbar-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .toolbar-btn:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }

    .toolbar-btn.active {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }

    .toolbar-divider {
      width: 1px;
      background: #e5e7eb;
      margin: 0 0.5rem;
    }

    .editor-content {
      display: flex;
    }

    .editor-content.split {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .editor-pane {
      flex: 1;
    }

    .editor-textarea {
      width: 100%;
      padding: 1rem;
      border: none;
      resize: vertical;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      outline: none;
    }

    .preview-pane {
      flex: 1;
      border-left: 1px solid #e5e7eb;
      background: #fafafa;
    }

    .markdown-preview {
      padding: 1rem;
      overflow-y: auto;
      line-height: 1.6;
    }

    .markdown-preview :deep(h1) {
      font-size: 2rem;
      font-weight: 700;
      margin: 1.5rem 0 1rem 0;
      color: #1f2937;
    }

    .markdown-preview :deep(h2) {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 1.25rem 0 0.75rem 0;
      color: #374151;
    }

    .markdown-preview :deep(h3) {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 1rem 0 0.5rem 0;
      color: #4b5563;
    }

    .markdown-preview :deep(p) {
      margin: 0.75rem 0;
      color: #1f2937;
    }

    .markdown-preview :deep(ul),
    .markdown-preview :deep(ol) {
      margin: 0.75rem 0;
      padding-right: 2rem;
    }

    .markdown-preview :deep(li) {
      margin: 0.25rem 0;
    }

    .markdown-preview :deep(code) {
      background: #f3f4f6;
      padding: 0.125rem 0.25rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.875em;
    }

    .markdown-preview :deep(pre) {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }

    .markdown-preview :deep(pre code) {
      background: none;
      padding: 0;
      color: inherit;
    }

    .markdown-preview :deep(blockquote) {
      border-right: 4px solid #10b981;
      padding-right: 1rem;
      margin: 1rem 0;
      color: #6b7280;
      font-style: italic;
    }

    .markdown-preview :deep(a) {
      color: #10b981;
      text-decoration: none;
    }

    .markdown-preview :deep(a:hover) {
      text-decoration: underline;
    }

    .markdown-preview :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 1rem 0;
    }

    .markdown-preview :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    .markdown-preview :deep(th),
    .markdown-preview :deep(td) {
      border: 1px solid #e5e7eb;
      padding: 0.5rem;
      text-align: right;
    }

    .markdown-preview :deep(th) {
      background: #f9fafb;
      font-weight: 600;
    }

    .markdown-preview :deep(hr) {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 2rem 0;
    }
  `]
})
export class MarkdownEditorComponent implements ControlValueAccessor {
  @Input() height = 400;
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  viewMode: 'edit' | 'split' | 'preview' = 'split';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = (value: string) => {
      fn(value);
      this.valueChange.emit(value);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  insertMarkdown(before: string, after: string): void {
    const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.value.substring(start, end);
    const newText = this.value.substring(0, start) + before + selectedText + after + this.value.substring(end);
    
    this.value = newText;
    this.onChange(this.value);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }
}
