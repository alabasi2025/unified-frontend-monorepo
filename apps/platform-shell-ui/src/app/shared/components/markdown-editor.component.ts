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
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
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
