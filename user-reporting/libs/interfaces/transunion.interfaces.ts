export type TransunionInput = {
  authenticated?: boolean | null;
  authenticatedOn?: string | null;
  indicativeEnrichmentSuccess?: boolean | null;
  indicativeEnrichmentStatus?: TUStatusRefInput | null;
  getAuthenticationQuestionsSuccess?: boolean | null;
  getAuthenticationQuestionsStatus?: TUStatusRefInput | null;
  verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
  verifyAuthenticationQuestionsOTPStatus?: TUStatusRefInput | null;
  verifyAuthenticationQuestionsKBASuccess?: boolean | null;
  verifyAuthenticationQuestionsKBAStatus?: TUStatusRefInput | null;
  serviceBundleFulfillmentKey?: string | null;
  currentRawQuestions?: string | null;
  currentRawAuthDetails?: string | null;
  authAttempt?: number | null;
  pinRequests?: number | null;
  pinAttempts?: number | null;
  pinCurrentAge?: number | null;
  kbaAttempts?: number | null;
  kbaCurrentAge?: number | null;
  enrollmentKey?: string | null;
  enrollReport?: TUReportResponseInput | null;
  enrollMergeReport?: TUReportResponseInput | null;
  enrollVantageScore?: TUReportResponseInput | null;
  enrolled?: boolean | null;
  enrolledOn?: string | null;
  fulfillReport?: TUReportResponseInput | null;
  fulfillMergeReport?: TUReportResponseInput | null;
  fulfillVantageScore?: TUReportResponseInput | null;
  fulfilledOn?: string | null;
  acknowledgedDisputeTerms?: boolean | null;
  acknowledgedDisputeTermsOn?: string | null;
  disputeServiceBundleFulfillmentKey?: string | null;
  disputeEnrollmentKey?: string | null;
  disputeEnrolled?: boolean | null;
  disputeEnrolledOn?: string | null;
};

export type TUStatusRefInput = {
  id?: string | null;
  status?: string | null;
  statusDescription?: string | null;
  statusModifiedOn?: string | null;
  statusCode?: string | null;
};

export type TUReportResponseInput = {
  bureau?: string | null;
  errorResponse?: string | null;
  serviceProduct?: string | null;
  serviceProductFullfillmentKey?: string | null;
  serviceProductObject?: string | null;
  serviceProductTypeId?: string | null;
  serviceProductValue?: string | null;
  status?: string | null;
};

export type UserAttributesInput = {
  name?: NameInput | null;
  address?: AddressInput | null;
  phone?: PhoneInput | null;
  dob?: DobInput | null;
  ssn?: SsnInput | null;
};

export type NameInput = {
  first: string;
  middle?: string | null;
  last: string;
};

export type AddressInput = {
  addressOne: string;
  addressTwo?: string | null;
  city: string;
  state: string;
  zip: string;
};

export type PhoneInput = {
  primary: string;
};

export type DobInput = {
  year: string;
  month: string;
  day: string;
};

export type SsnInput = {
  lastfour: string;
  full?: string | null;
};
