import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService, Category } from "../../shared/services/category.service";

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedCategory: Category | null = null;
  filterForm: FormGroup;
  
  @Output() categorySelected = new EventEmitter<void>();

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder
  ) { 
    this.filterForm = this.formBuilder.group({
      categoryName: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  onFilter(): void {
    const filterValue = this.filterForm.get('categoryName')?.value?.toLowerCase() || '';
    
    if (filterValue === '') {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category => 
        category.categoryLabel.toLowerCase().includes(filterValue)
      );
    }
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
