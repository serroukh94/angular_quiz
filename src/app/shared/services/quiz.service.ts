import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';

export enum QuizStep {
  CATEGORY_SELECTION = 'category-selection',
  QUIZ_PREPARATION = 'quiz-preparation',
  QUIZ_STARTED = 'quiz-started',
  QUIZ_FINISHED = 'quiz-finished'
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  quizContent: any[] = [];
  playerAnswers: {questionId: number; answer: string}[] = [];
  score = 0;
  isQuizFinished = false;
  playerName: string = '';

  // Gestion des étapes
  private currentStepSubject = new BehaviorSubject<QuizStep>(QuizStep.CATEGORY_SELECTION);
  currentStep$ = this.currentStepSubject.asObservable();

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) { }

  setCurrentStep(step: QuizStep) {
    this.currentStepSubject.next(step);
  }

  getCurrentStep(): QuizStep {
    return this.currentStepSubject.value;
  }

  loadQuiz() {
    const categoryId = this.categoryService.getSelectedCategoryId();
    if (categoryId) {
      this.getQuizContent(categoryId);
      this.setCurrentStep(QuizStep.QUIZ_STARTED);
    }
  }

  resetCategorySelection() {
    this.categoryService.resetSelectedCategory();
    this.quizContent = [];
    this.playerAnswers = [];
    this.score = 0;
    this.isQuizFinished = false;
    this.setCurrentStep(QuizStep.CATEGORY_SELECTION);
  }

  checkAnswers() {
    this.score = 0;
    for (let i = 0; i < this.playerAnswers.length; i++) {
      const question = this.quizContent.find((q) => q.id === this.playerAnswers[i].questionId);
      if (!question) continue;
      for (let j = 0; j < question.answers.length; j++) {
        const currentAnswer = question.answers[j];
        if (currentAnswer?.isCorrect && this.playerAnswers[i].answer === currentAnswer.answerLabel) {
          this.score += 1;
          break;
        }
      }
    }
    this.isQuizFinished = true;
    this.setCurrentStep(QuizStep.QUIZ_FINISHED);
  }

  addAnswer(answer: string, questionId: number) {
    const isAnswered = this.playerAnswers.find((a) => a.questionId === questionId);
    if (isAnswered) {
      isAnswered.answer = answer;
      return;
    }
    this.playerAnswers.push({questionId, answer});
  }

  getQuizContent(categoryId: number) {
    this.quizContent = [];
    
    this.http.get('http://localhost:3000/questions').subscribe((questions: any) => {
      const filteredQuestions = questions.filter((question: any) => {
        return question.categoryId === categoryId;
      });
      
      for (const question of filteredQuestions) {
        this.http.get(`http://localhost:3000/answers?questionId=${question.id}`).subscribe((answers: any) => {
          this.quizContent.push({
              id: question.id,
              question: question.questionLabel,
              answers
          });
        });
      }
    });
  }

  resetQuiz() {
    this.quizContent = [];
    this.categoryService.resetSelectedCategory();
    this.playerAnswers = [];
    this.score = 0;
    this.isQuizFinished = false;
    this.setCurrentStep(QuizStep.CATEGORY_SELECTION);
  }

  getSelectedCategoryLabel(): string {
    return this.categoryService.getSelectedCategoryLabel();
  }
}
