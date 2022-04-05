export interface ITransunionKBAQuestions {
  ChallengeConfigurationType: {
    RulesApp: string;
    CorrectAnswersNeeded: string;
    AnswerAttemptsAllowed: string;
    MultiChoiceQuestion: ITransunionKBAQuestion[] | ITransunionKBAQuestion;
    ApplicantChallengeId: string;
    ApplicantId: string;
  };
}

export interface ITransunionKBAInProgressQuestions {
  ChallengeConfiguration: {
    RulesApp: string;
    CorrectAnswersNeeded: string;
    AnswerAttemptsAllowed: string;
    MultiChoiceQuestion: ITransunionKBAQuestion[] | ITransunionKBAQuestion;
    ApplicantChallengeId: string;
    ApplicantId: string;
  };
}

export interface ITransunionKBAQuestion {
  QuestionType: string;
  SequenceNumber: string;
  LastChanceQuestion: string;
  FakeQuestion: string;
  FullQuestionText: string;
  KeyQuestionText: {
    PromptDate: string;
  };
  AnswerChoice: ITransunionKBAAnswer[] | ITransunionKBAAnswer;
  Key: string;
  QuestionId: string;
}

export interface ITransunionKBAAnswer {
  SequenceNumber: string;
  IsCorrectAnswer: string;
  AnswerChoiceText: string;
  Key: string;
  AnswerChoiceId: string;
}

export interface ITransunionBAAnsweredQuestion {
  VerifyChallengeAnswersRequestMultiChoiceQuestion: {
    QuestionId: number;
    SelectedAnswerChoice: {
      AnswerChoiceId: string;
    };
    AnswerChoiceText: string;
    IsCorrectAnswer?: boolean;
    Key: string;
  };
}

export interface ITransunionKBAChallengeAnswer {
  VerifyChallengeAnswersResponseSuccess: {
    AnswerVerificationStatus: string;
    ApplicantChallengeId: string;
    ChallengeConfiguration: {
      RulesApp: string;
      CorrectAnswersNeeded: string;
      AnswerAttemptsAllowed: string;
      MultiChoiceQuestion: ITransunionKBAQuestion[] | ITransunionKBAQuestion;
      ApplicantChallengeId: string;
      ApplicantId: string;
    };
  };
}
