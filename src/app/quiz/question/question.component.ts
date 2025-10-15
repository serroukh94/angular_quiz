import { Component, OnInit } from '@angular/core';
import { QuizService } from "../../shared/services/quiz.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: false
})
export class QuestionComponent implements OnInit {
  quizContent: any[] = this.quizService.quizContent;
  categoryId: any = this.quizService.categoryId;

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.quizService.getQuizContent(this.categoryId);
  }

  addAnswer(answer: string, questionId: number) {
    this.quizService.addAnswer(answer, questionId);
  }
}
