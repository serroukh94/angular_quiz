import { Component, OnInit } from '@angular/core';
import { QuizService } from "../../shared/services/quiz.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: false
})
export class QuestionComponent implements OnInit {

  constructor(private quizService: QuizService) { }

  get quizContent() {
    return this.quizService.quizContent;
  }

  ngOnInit(): void {
    // Le contenu sera chargé par le quiz.component lors du startQuiz()
  }

  addAnswer(answer: string, questionId: number) {
    this.quizService.addAnswer(answer, questionId);
  }
}
