import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';

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
  categories: any[] = [];
  categoryId: any = null;
  playerAnswers: {questionId: number; answer: string}[] = [];
  score = 0;
  isQuizFinished = false;
  playerName: string = '';

  // Gestion des étapes
  private currentStepSubject = new BehaviorSubject<QuizStep>(QuizStep.CATEGORY_SELECTION);
  currentStep$ = this.currentStepSubject.asObservable();

  constructor(private http: HttpClient) { }

  setCurrentStep(step: QuizStep) {
    this.currentStepSubject.next(step);
  }

  getCurrentStep(): QuizStep {
    return this.currentStepSubject.value;
  }

  loadQuiz() {
    if (this.categoryId) {
      this.getQuizContent(this.categoryId);
      this.setCurrentStep(QuizStep.QUIZ_STARTED);
    }
  }

  resetCategorySelection() {
    this.categoryId = null;
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

  setCategoryId(categoryId: any) {
    this.categoryId = categoryId;
  }

  getCategories() {
    return this.http.get('http://localhost:3000/categories').subscribe((categories: any) => {
      for (const category of categories) {
        this.categories.push({
            id: category.id,
            categoryLabel: category.categoryLabel
        });
      }
    });
  }

  getQuizContent(categoryId: number) {
    this.quizContent = [];
    
    console.log('Searching for questions with categoryId:', categoryId);
    
    this.http.get('http://localhost:3000/questions').subscribe((questions: any) => {
      console.log('All questions:', questions);

      const filteredQuestions = questions.filter((question: any) => {
        console.log(`Question ${question.id}: categoryId=${question.categoryId}, target=${categoryId}, match=${question.categoryId === categoryId}`);
        return question.categoryId === categoryId;
      });
      
      console.log('Filtered questions:', filteredQuestions);
      
      for (const question of filteredQuestions) {
        this.http.get(`http://localhost:3000/answers?questionId=${question.id}`).subscribe((answers: any) => {
          console.log(`Adding question ${question.id} with answers:`, answers);
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
    this.categoryId = null;
    this.categories = [];
    this.playerAnswers = [];
    this.score = 0;
    this.isQuizFinished = false;
    this.setCurrentStep(QuizStep.CATEGORY_SELECTION);
  }

  getSelectedCategoryLabel(): string {
    if (this.categoryId) {
      const category = this.categories.find(cat => cat.id === this.categoryId);
      return category ? category.categoryLabel : '';
    }
    return '';
  }
}
