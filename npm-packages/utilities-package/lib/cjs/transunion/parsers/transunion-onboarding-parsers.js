"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransunionOnboardingParsers = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const constants_1 = require("../constants");
const transunion_missing_1 = require("../transunion-missing");
const he = require('he');
const parserOptions = {
    attributeNamePrefix: '',
    ignoreAttributes: false,
    ignoreNameSpace: true,
    parseAttributeValue: true,
    attrValueProcessor: (val, attrName) => he.encode(val, { isAttributeValue: true }),
    tagValueProcessor: (val, tagName) => he.encode(val), //default is a=>a
};
class TransunionOnboardingParsers extends transunion_missing_1.TransunionMissing {
    constructor() {
        super();
    }
    /**
     * Helper method to parse the auth questions as embeded objects
     * @param questions
     * @returns
     */
    static parseAuthQuestions(questions) {
        if (!questions)
            return '';
        const questionXml = questions.Questions;
        return questionXml ? questionXml : '';
    }
    /**
     * Helper method to parse the auth questions as embeded objects
     * @param questions
     * @returns
     */
    static parseVerificationInProgressQuestions(questions) {
        if (!questions)
            return '';
        const questionXml = questions.AuthenticationDetails;
        return questionXml ? questionXml : '';
    }
    /**
     * This parses the xml string and returns it as the TU question format
     * @param xml xml string in the TU question schema
     * @returns
     */
    static parseCurrentRawAuthXML(xml) {
        // need two decodes, encoded by TU and our default parser settings
        const clean = he.decode(he.decode(xml));
        const questions = this.parser.parse(clean);
        return questions;
    }
    /**
     * Runs a series of tests to see if the question is a OTP
     * @param questions
     * @returns
     */
    static parseOTPQuestion(questions) {
        var _a, _b, _c;
        const series = ((_a = questions === null || questions === void 0 ? void 0 : questions.ChallengeConfigurationType) === null || _a === void 0 ? void 0 : _a.MultiChoiceQuestion) instanceof Array
            ? (_b = questions === null || questions === void 0 ? void 0 : questions.ChallengeConfigurationType) === null || _b === void 0 ? void 0 : _b.MultiChoiceQuestion
            : new Array((_c = questions === null || questions === void 0 ? void 0 : questions.ChallengeConfigurationType) === null || _c === void 0 ? void 0 : _c.MultiChoiceQuestion);
        return series.find((q) => q.FullQuestionText === constants_1.OTPQuestion.FullText ||
            q.FullQuestionText.indexOf(constants_1.OTPQuestion.PartialOne) >= 0 ||
            q.FullQuestionText.indexOf(constants_1.OTPQuestion.PartialTwo) >= 0);
    }
    /**
     * Runs a series of test to find the 'Send text message' answer for OTP
     * @param question
     * @returns
     */
    static parseOTPSendTextAnswer(question) {
        const answerChoice = (question === null || question === void 0 ? void 0 : question.AnswerChoice) instanceof Array ? question === null || question === void 0 ? void 0 : question.AnswerChoice : new Array(question === null || question === void 0 ? void 0 : question.AnswerChoice);
        let answer = answerChoice.find((c) => c.AnswerChoiceText === constants_1.OTPReponse.FullText || c.AnswerChoiceText.indexOf(constants_1.OTPReponse.PartialOne) >= 0);
        return {
            VerifyChallengeAnswersRequestMultiChoiceQuestion: {
                QuestionId: question === null || question === void 0 ? void 0 : question.QuestionId,
                SelectedAnswerChoice: {
                    AnswerChoiceId: (answer === null || answer === void 0 ? void 0 : answer.AnswerChoiceId) || '',
                },
            },
        };
    }
    /**
     * Runs a series of tests to see if the question is for the passcode
     * @param questions
     * @returns
     */
    static parsePassCodeQuestion(questions) {
        const series = questions.ChallengeConfigurationType.MultiChoiceQuestion instanceof Array
            ? questions.ChallengeConfigurationType.MultiChoiceQuestion
            : new Array(questions.ChallengeConfigurationType.MultiChoiceQuestion);
        return series.find((q) => q.FullQuestionText === constants_1.PassCodeQuestion.FullText ||
            q.FullQuestionText.indexOf(constants_1.PassCodeQuestion.PartialOne) >= 0);
    }
    /**
     * Runs a series of test to find the 'Send text message' answer for OTP
     * @param question
     * @returns
     */
    static parsePassCodeAnswer(question, input) {
        const answerChoice = question.AnswerChoice instanceof Array ? question.AnswerChoice : new Array(question.AnswerChoice);
        const answer = answerChoice.find((c) => c.AnswerChoiceText === constants_1.PassCodeQuestion.FullText ||
            c.AnswerChoiceText.indexOf(constants_1.PassCodeQuestion.PartialOne) >= 0);
        return {
            VerifyChallengeAnswersRequestMultiChoiceQuestion: {
                QuestionId: question === null || question === void 0 ? void 0 : question.QuestionId,
                SelectedAnswerChoice: {
                    AnswerChoiceId: (answer === null || answer === void 0 ? void 0 : answer.AnswerChoiceId) || '',
                    UserInputAnswer: input,
                },
            },
        };
    }
}
exports.TransunionOnboardingParsers = TransunionOnboardingParsers;
TransunionOnboardingParsers.parser = new fast_xml_parser_1.XMLParser(parserOptions);
