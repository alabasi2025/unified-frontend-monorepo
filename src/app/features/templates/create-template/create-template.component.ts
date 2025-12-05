import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {
  templateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.templateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['', Validators.required],
      content: [{}, Validators.required] // سيتم التعامل مع المحتوى لاحقًا
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.templateForm.valid) {
      console.log('Form Submitted', this.templateForm.value);
      // منطق الإرسال الفعلي سيتم إضافته في مرحلة لاحقة
    }
  }
}
