import { XMLParser } from 'fast-xml-parser';
import { IVerifyAuthenticationAnswer } from '../../_types/verify-authentication-answers';
import { IGetAuthenticationQuestionsResult } from '../../_types/get-authorization-questions';
import { IVerifyAuthenticationQuestionsResult } from '../../_types/verify-authentication-response';
import { OTPQuestion, OTPReponse, PassCodeQuestion } from '../../_constants/transunion';
import { ITransunionKBAQuestions, ITransunionKBAQuestion } from '../../_types/kba-questions';

const he = require('he');
const parserOptions = {
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  parseAttributeValue: true,
  attrValueProcessor: (val: any, attrName: any) => he.encode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val: any, tagName: any) => he.encode(val), //default is a=>a
};

export class TransunionOnboardingParsers {
  static parser = new XMLParser(parserOptions);
  constructor() {}

  /**
   * Helper method to parse the auth questions as embeded objects
   * @param questions
   * @returns
   */
  static parseAuthQuestions(questions: IGetAuthenticationQuestionsResult | undefined): string | undefined {
    if (!questions) return '';
    const questionXml = questions.Questions;
    return questionXml ? questionXml : '';
  }

  /**
   * Helper method to parse the auth questions as embeded objects
   * @param questions
   * @returns
   */
  static parseVerificationInProgressQuestions(
    questions: IVerifyAuthenticationQuestionsResult | undefined,
  ): string | undefined {
    if (!questions) return '';
    const questionXml = questions.AuthenticationDetails;
    return questionXml ? questionXml : '';
  }

  /**
   * This parses the xml string and returns it as the TU question format
   * @param xml xml string in the TU question schema
   * @returns
   */
  static parseCurrentRawAuthXML<T>(xml: string): T {
    // need two decodes, encoded by TU and our default parser settings
    const clean = he.decode(he.decode(xml));
    const questions: T = this.parser.parse(clean);
    return questions;
  }

  /**
   * Runs a series of tests to see if the question is a OTP
   * @param questions
   * @returns
   */
  static parseOTPQuestion(questions: ITransunionKBAQuestions): ITransunionKBAQuestion | undefined {
    const series: ITransunionKBAQuestion[] | ITransunionKBAQuestion =
      questions?.ChallengeConfigurationType?.MultiChoiceQuestion instanceof Array
        ? questions?.ChallengeConfigurationType?.MultiChoiceQuestion
        : new Array(questions?.ChallengeConfigurationType?.MultiChoiceQuestion);
    return series.find(
      (q) =>
        q.FullQuestionText === OTPQuestion.FullText ||
        q.FullQuestionText.indexOf(OTPQuestion.PartialOne) >= 0 ||
        q.FullQuestionText.indexOf(OTPQuestion.PartialTwo) >= 0,
    );
  }

  /**
   * Runs a series of test to find the 'Send text message' answer for OTP
   * @param question
   * @returns
   */
  static parseOTPSendTextAnswer(question: ITransunionKBAQuestion): IVerifyAuthenticationAnswer {
    const answerChoice =
      question?.AnswerChoice instanceof Array ? question?.AnswerChoice : new Array(question?.AnswerChoice);

    let answer = answerChoice.find(
      (c) => c.AnswerChoiceText === OTPReponse.FullText || c.AnswerChoiceText.indexOf(OTPReponse.PartialOne) >= 0,
    );
    return {
      VerifyChallengeAnswersRequestMultiChoiceQuestion: {
        QuestionId: question?.QuestionId,
        SelectedAnswerChoice: {
          AnswerChoiceId: answer?.AnswerChoiceId || '',
        },
      },
    };
  }

  /**
   * Runs a series of tests to see if the question is for the passcode
   * @param questions
   * @returns
   */
  static parsePassCodeQuestion(questions: ITransunionKBAQuestions): ITransunionKBAQuestion | undefined {
    const series: ITransunionKBAQuestion[] =
      questions.ChallengeConfigurationType.MultiChoiceQuestion instanceof Array
        ? questions.ChallengeConfigurationType.MultiChoiceQuestion
        : new Array(questions.ChallengeConfigurationType.MultiChoiceQuestion);
    return series.find(
      (q) =>
        q.FullQuestionText === PassCodeQuestion.FullText ||
        q.FullQuestionText.indexOf(PassCodeQuestion.PartialOne) >= 0,
    );
  }

  /**
   * Runs a series of test to find the 'Send text message' answer for OTP
   * @param question
   * @returns
   */
  static parsePassCodeAnswer(question: ITransunionKBAQuestion, input: string): IVerifyAuthenticationAnswer {
    const answerChoice =
      question.AnswerChoice instanceof Array ? question.AnswerChoice : new Array(question.AnswerChoice);
    const answer = answerChoice.find(
      (c) =>
        c.AnswerChoiceText === PassCodeQuestion.FullText ||
        c.AnswerChoiceText.indexOf(PassCodeQuestion.PartialOne) >= 0,
    );
    return {
      VerifyChallengeAnswersRequestMultiChoiceQuestion: {
        QuestionId: question?.QuestionId,
        SelectedAnswerChoice: {
          AnswerChoiceId: answer?.AnswerChoiceId || '',
          UserInputAnswer: input,
        },
      },
    };
  }
}
