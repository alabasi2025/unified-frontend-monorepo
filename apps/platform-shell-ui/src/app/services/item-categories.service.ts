import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCategory, CreateItemCategory } from '../models/item-category.model';

@Injectable({
  providedIn: 'root'
})
export class ItemCategoriesService {
  private apiUrl = '/api/item-categories'; // يجب تعديل المسار حسب إعدادات المشروع

  constructor(private http: HttpClient) { }

  /**
   * جلب جميع أصناف المواد
   */
  getAllCategories(): Observable<ItemCategory[]> {
    return this.http.get<ItemCategory[]>(this.apiUrl);
  }

  /**
   * إنشاء صنف مادة جديد
   * @param categoryData بيانات الصنف الجديد
   */
  createCategory(categoryData: CreateItemCategory): Observable<ItemCategory> {
    return this.http.post<ItemCategory>(this.apiUrl, categoryData);
  }

  /**
   * تحديث صنف مادة
   * @param id معرف الصنف
   * @param categoryData البيانات المراد تحديثها
   */
  updateCategory(id: number, categoryData: Partial<CreateItemCategory>): Observable<ItemCategory> {
    return this.http.patch<ItemCategory>(`${this.apiUrl}/${id}`, categoryData);
  }

  /**
   * حذف صنف مادة
   * @param id معرف الصنف
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
