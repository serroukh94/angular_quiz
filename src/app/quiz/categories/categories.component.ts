import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService, Category } from "../../shared/services/category.service";

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  
  @Output() categorySelected = new EventEmitter<void>();

  constructor(private categoryService: CategoryService) { 
    
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  setCategoryId(category: Category) {
    this.selectedCategory = category;
    this.categoryService.setSelectedCategory(category);
  }

  getSelectedCategory(): Category | null {
    return this.selectedCategory;
  }

  onConfirmCategory() {
    if (this.getSelectedCategory() != null) {
      this.categorySelected.emit();
    }
  }
}
