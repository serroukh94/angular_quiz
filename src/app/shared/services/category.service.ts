import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Category {
  id: number;
  categoryLabel: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [];
  private selectedCategorySubject = new BehaviorSubject<Category | null>(null);
  
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/categories');
  }

  loadCategories(): void {
    this.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  getAllCategories(): Category[] {
    return this.categories;
  }

  setSelectedCategory(category: Category): void {
    this.selectedCategorySubject.next(category);
  }

  getSelectedCategory(): Category | null {
    return this.selectedCategorySubject.value;
  }

  getSelectedCategoryId(): number | null {
    const category = this.getSelectedCategory();
    if (!category) return null;
    
    const id = typeof category.id === 'string' ? parseInt(category.id) : category.id;
    console.log('ID de la catégorie sélectionnée:', id, '(type:', typeof id, ')');
    return id;
  }

  getSelectedCategoryLabel(): string {
    const category = this.getSelectedCategory();
    return category ? category.categoryLabel : '';
  }

  resetSelectedCategory(): void {
    this.selectedCategorySubject.next(null);
  }
}