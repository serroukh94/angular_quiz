import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { QuizService } from "../shared/services/quiz.service";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  standalone: false
})
export class QuizComponent implements OnInit {
  isQuizFinished = this.quizService.isQuizFinished;
  playerName = '';
  showCategories = true;
  showPreparation = false;
  showQuiz = false;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizService.playerName = params['playerName'];
      this.playerName = params['playerName'];
    });
  }

  onCategorySelected() {
    this.showCategories = false;
    this.showPreparation = true;
    this.showQuiz = false;
  }

  startQuiz() {
    this.showCategories = false;
    this.showPreparation = false;
    this.showQuiz = true;
    this.quizService.loadQuiz();
  }

  goBackToCategories() {
    this.showCategories = true;
    this.showPreparation = false;
    this.showQuiz = false;
    this.quizService.resetCategorySelection();
  }

  goToResultPage() {
    this.router.navigate(['/result']);
  }

  getSelectedCategoryLabel(): string {
    return this.quizService.getSelectedCategoryLabel();
  }
}
