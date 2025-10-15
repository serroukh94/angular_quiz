import { Component, Output, EventEmitter } from '@angular/core';
import { QuizService } from "../../shared/services/quiz.service";

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categories: any[] = this.quizService.categories;
  
  @Output() categorySelected = new EventEmitter<void>();

  constructor(private quizService: QuizService) { 
    
  }

  ngOnInit(): void {
    this.quizService.getCategories()
  }

  setCategoryId(categoryId: any) {
    this.quizService.setCategoryId(categoryId);
  }

  getSelectedCategoryId() {
    return this.quizService.categoryId;
  }

  onConfirmCategory() {
    if (this.getSelectedCategoryId() != null) {
      this.categorySelected.emit();
    }
  }
}
