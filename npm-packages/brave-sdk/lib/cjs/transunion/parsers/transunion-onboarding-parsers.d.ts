import { XMLParser } from 'fast-xml-parser';
import { IVerifyAuthenticationAnswer } from '../../_types/verify-authentication-answers';
import { IGetAuthenticationQuestionsResult } from '../../_types/get-authorization-questions';
import { IVerifyAuthenticationQuestionsResult } from '../../_types/verify-authentication-response';
import { ITransunionKBAQuestions, ITransunionKBAQuestion } from '../../_types/kba-questions';
export declare class TransunionOnboardingParsers {
    static parser: XMLParser;
    constructor();
    /**
     * Helper method to parse the auth questions as embeded objects
     * @param questions
     * @returns
     */
    static parseAuthQuestions(questions: IGetAuthenticationQuestionsResult | undefined): string | undefined;
    /**
     * Helper method to parse the auth questions as embeded objects
     * @param questions
     * @returns
     */
    static parseVerificationInProgressQuestions(questions: IVerifyAuthenticationQuestionsResult | undefined): string | undefined;
    /**
     * This parses the xml string and returns it as the TU question format
     * @param xml xml string in the TU question schema
     * @returns
     */
    static parseCurrentRawAuthXML<T>(xml: string): T;
    /**
     * Runs a series of tests to see if the question is a OTP
     * @param questions
     * @returns
     */
    static parseOTPQuestion(questions: ITransunionKBAQuestions): ITransunionKBAQuestion | undefined;
    /**
     * Runs a series of test to find the 'Send text message' answer for OTP
     * @param question
     * @returns
     */
    static parseOTPSendTextAnswer(question: ITransunionKBAQuestion): IVerifyAuthenticationAnswer;
    /**
     * Runs a series of tests to see if the question is for the passcode
     * @param questions
     * @returns
     */
    static parsePassCodeQuestion(questions: ITransunionKBAQuestions): ITransunionKBAQuestion | undefined;
    /**
     * Runs a series of test to find the 'Send text message' answer for OTP
     * @param question
     * @returns
     */
    static parsePassCodeAnswer(question: ITransunionKBAQuestion, input: string): IVerifyAuthenticationAnswer;
}
