export declare type __SubscriptionContainer = {
    onCreateAppData: OnCreateAppDataSubscription;
    onUpdateAppData: OnUpdateAppDataSubscription;
    onDeleteAppData: OnDeleteAppDataSubscription;
};
export declare type Transunion = {
    __typename: "Transunion";
    authenticated?: boolean | null;
    authenticatedOn?: string | null;
    indicativeEnrichmentSuccess?: boolean | null;
    indicativeEnrichmentStatus?: TUStatusRef | null;
    getAuthenticationQuestionsSuccess?: boolean | null;
    getAuthenticationQuestionsStatus?: TUStatusRef | null;
    verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
    verifyAuthenticationQuestionsOTPStatus?: TUStatusRef | null;
    verifyAuthenticationQuestionsKBASuccess?: boolean | null;
    verifyAuthenticationQuestionsKBAStatus?: TUStatusRef | null;
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
    enrollReport?: TUReportResponse | null;
    enrollMergeReport?: TUReportResponse | null;
    enrollVantageScore?: TUReportResponse | null;
    enrolled?: boolean | null;
    enrolledOn?: string | null;
    fulfillReport?: TUReportResponse | null;
    fulfillMergeReport?: TUReportResponse | null;
    fulfillVantageScore?: TUReportResponse | null;
    fulfilledOn?: string | null;
    acknowledgedDisputeTerms?: boolean | null;
    acknowledgedDisputeTermsOn?: string | null;
    disputeServiceBundleFulfillmentKey?: string | null;
    disputeEnrollmentKey?: string | null;
    disputeEnrolled?: boolean | null;
    disputeEnrolledOn?: string | null;
};
export declare type TUStatusRef = {
    __typename: "TUStatusRef";
    id?: string | null;
    status?: string | null;
    statusDescription?: string | null;
    statusModifiedOn?: string | null;
    statusCode?: string | null;
};
export declare type TUReportResponse = {
    __typename: "TUReportResponse";
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
};
export declare type CreateAppDataInput = {
    id?: string | null;
    user: UserInput;
    agencies: AgenciesInput;
    preferences: PreferencesInput;
    dashboard?: DashboardInput | null;
    navBar?: NavBarInput | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
};
export declare type UserInput = {
    id: string;
    userAttributes?: UserAttributesInput | null;
    onboarding?: OnboardingInput | null;
};
export declare type UserAttributesInput = {
    name?: NameInput | null;
    address?: AddressInput | null;
    phone?: PhoneInput | null;
    dob?: DobInput | null;
    ssn?: SsnInput | null;
};
export declare type NameInput = {
    first: string;
    middle?: string | null;
    last: string;
};
export declare type AddressInput = {
    addressOne: string;
    addressTwo?: string | null;
    city: string;
    state: string;
    zip: string;
};
export declare type PhoneInput = {
    primary: string;
};
export declare type DobInput = {
    year: string;
    month: string;
    day: string;
};
export declare type SsnInput = {
    lastfour: string;
    full?: string | null;
};
export declare type OnboardingInput = {
    lastActive: number;
    lastComplete: number;
    started?: boolean | null;
    abandoned?: boolean | null;
    display?: Array<OnboardingStepInput | null> | null;
};
export declare type OnboardingStepInput = {
    id?: number | null;
    active?: boolean | null;
    complete?: boolean | null;
    name?: string | null;
};
export declare type AgenciesInput = {
    transunion?: TransunionInput | null;
    equifax?: EquifaxInput | null;
    experian?: ExperianInput | null;
};
export declare type TransunionInput = {
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
export declare type TUStatusRefInput = {
    id?: string | null;
    status?: string | null;
    statusDescription?: string | null;
    statusModifiedOn?: string | null;
    statusCode?: string | null;
};
export declare type TUReportResponseInput = {
    bureau?: string | null;
    errorResponse?: string | null;
    serviceProduct?: string | null;
    serviceProductFullfillmentKey?: string | null;
    serviceProductObject?: string | null;
    serviceProductTypeId?: string | null;
    serviceProductValue?: string | null;
    status?: string | null;
};
export declare type EquifaxInput = {
    authenticated?: boolean | null;
};
export declare type ExperianInput = {
    authenticated?: boolean | null;
};
export declare type PreferencesInput = {
    showAllAccounts?: ShowAccountsPreferenceInput | null;
};
export declare type ShowAccountsPreferenceInput = {
    creditCards?: boolean | null;
    collectionsAccounts?: boolean | null;
    installmentLoans?: boolean | null;
    mortgages?: boolean | null;
};
export declare type DashboardInput = {
    isLoaded?: boolean | null;
    negativeFlagged?: boolean | null;
    negativeCardCount?: number | null;
    negativeCardStatus?: string | null;
    negativeReviewed?: boolean | null;
    negativeStatus?: string | null;
    forbearanceFlagged?: boolean | null;
    forbearanceCardStatus?: string | null;
    forbearanceReviewed?: boolean | null;
    forbearanceStatus?: string | null;
    databreachFlagged?: boolean | null;
    databreachCards?: Array<DataBreachCardInput | null> | null;
    databreachCardStatus?: string | null;
    databreachReviewed?: boolean | null;
    databreachStatus?: string | null;
};
export declare type DataBreachCardInput = {
    reason?: string | null;
    reviewed?: boolean | null;
    condition?: string | null;
    subscriber?: string | null;
    paragraphs?: Array<string | null> | null;
};
export declare type NavBarInput = {
    home?: NavBarConfigInput | null;
    report?: NavBarConfigInput | null;
    disputes?: NavBarConfigInput | null;
    settings?: NavBarConfigInput | null;
};
export declare type NavBarConfigInput = {
    badge?: boolean | null;
};
export declare type ModelAppDataConditionInput = {
    status?: ModelStringInput | null;
    statusReason?: ModelStringInput | null;
    statusReasonDescription?: ModelStringInput | null;
    lastStatusModifiedOn?: ModelStringInput | null;
    nextStatusModifiedOn?: ModelStringInput | null;
    isLoaded?: ModelBooleanInput | null;
    and?: Array<ModelAppDataConditionInput | null> | null;
    or?: Array<ModelAppDataConditionInput | null> | null;
    not?: ModelAppDataConditionInput | null;
};
export declare type ModelStringInput = {
    ne?: string | null;
    eq?: string | null;
    le?: string | null;
    lt?: string | null;
    ge?: string | null;
    gt?: string | null;
    contains?: string | null;
    notContains?: string | null;
    between?: Array<string | null> | null;
    beginsWith?: string | null;
    attributeExists?: boolean | null;
    attributeType?: ModelAttributeTypes | null;
    size?: ModelSizeInput | null;
};
export declare enum ModelAttributeTypes {
    binary = "binary",
    binarySet = "binarySet",
    bool = "bool",
    list = "list",
    map = "map",
    number = "number",
    numberSet = "numberSet",
    string = "string",
    stringSet = "stringSet",
    _null = "_null"
}
export declare type ModelSizeInput = {
    ne?: number | null;
    eq?: number | null;
    le?: number | null;
    lt?: number | null;
    ge?: number | null;
    gt?: number | null;
    between?: Array<number | null> | null;
};
export declare type ModelBooleanInput = {
    ne?: boolean | null;
    eq?: boolean | null;
    attributeExists?: boolean | null;
    attributeType?: ModelAttributeTypes | null;
};
export declare type AppData = {
    __typename: "AppData";
    id: string;
    user: User;
    agencies: Agencies;
    preferences: Preferences;
    dashboard?: Dashboard | null;
    navBar?: NavBar | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
export declare type User = {
    __typename: "User";
    id: string;
    userAttributes?: UserAttributes | null;
    onboarding?: Onboarding | null;
};
export declare type UserAttributes = {
    __typename: "UserAttributes";
    name?: Name | null;
    address?: Address | null;
    phone?: Phone | null;
    dob?: Dob | null;
    ssn?: Ssn | null;
};
export declare type Name = {
    __typename: "Name";
    first: string;
    middle?: string | null;
    last: string;
};
export declare type Address = {
    __typename: "Address";
    addressOne: string;
    addressTwo?: string | null;
    city: string;
    state: string;
    zip: string;
};
export declare type Phone = {
    __typename: "Phone";
    primary: string;
};
export declare type Dob = {
    __typename: "Dob";
    year: string;
    month: string;
    day: string;
};
export declare type Ssn = {
    __typename: "Ssn";
    lastfour: string;
    full?: string | null;
};
export declare type Onboarding = {
    __typename: "Onboarding";
    lastActive: number;
    lastComplete: number;
    started?: boolean | null;
    abandoned?: boolean | null;
    display?: Array<OnboardingStep | null> | null;
};
export declare type OnboardingStep = {
    __typename: "OnboardingStep";
    id?: number | null;
    active?: boolean | null;
    complete?: boolean | null;
    name?: string | null;
};
export declare type Agencies = {
    __typename: "Agencies";
    transunion?: Transunion | null;
    equifax?: Equifax | null;
    experian?: Experian | null;
};
export declare type Equifax = {
    __typename: "Equifax";
    authenticated?: boolean | null;
};
export declare type Experian = {
    __typename: "Experian";
    authenticated?: boolean | null;
};
export declare type Preferences = {
    __typename: "Preferences";
    showAllAccounts?: ShowAccountsPreference | null;
};
export declare type ShowAccountsPreference = {
    __typename: "ShowAccountsPreference";
    creditCards?: boolean | null;
    collectionsAccounts?: boolean | null;
    installmentLoans?: boolean | null;
    mortgages?: boolean | null;
};
export declare type Dashboard = {
    __typename: "Dashboard";
    isLoaded?: boolean | null;
    negativeFlagged?: boolean | null;
    negativeCardCount?: number | null;
    negativeCardStatus?: string | null;
    negativeReviewed?: boolean | null;
    negativeStatus?: string | null;
    forbearanceFlagged?: boolean | null;
    forbearanceCardStatus?: string | null;
    forbearanceReviewed?: boolean | null;
    forbearanceStatus?: string | null;
    databreachFlagged?: boolean | null;
    databreachCards?: Array<DataBreachCard | null> | null;
    databreachCardStatus?: string | null;
    databreachReviewed?: boolean | null;
    databreachStatus?: string | null;
};
export declare type DataBreachCard = {
    __typename: "DataBreachCard";
    reason?: string | null;
    reviewed?: boolean | null;
    condition?: string | null;
    subscriber?: string | null;
    paragraphs?: Array<string | null> | null;
};
export declare type NavBar = {
    __typename: "NavBar";
    home?: NavBarConfig | null;
    report?: NavBarConfig | null;
    disputes?: NavBarConfig | null;
    settings?: NavBarConfig | null;
};
export declare type NavBarConfig = {
    __typename: "NavBarConfig";
    badge?: boolean | null;
};
export declare type UpdateAppDataInput = {
    id: string;
    user?: UserInput | null;
    agencies?: AgenciesInput | null;
    preferences?: PreferencesInput | null;
    dashboard?: DashboardInput | null;
    navBar?: NavBarInput | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
};
export declare type DeleteAppDataInput = {
    id: string;
};
export declare type ModelAppDataFilterInput = {
    id?: ModelIDInput | null;
    status?: ModelStringInput | null;
    statusReason?: ModelStringInput | null;
    statusReasonDescription?: ModelStringInput | null;
    lastStatusModifiedOn?: ModelStringInput | null;
    nextStatusModifiedOn?: ModelStringInput | null;
    isLoaded?: ModelBooleanInput | null;
    and?: Array<ModelAppDataFilterInput | null> | null;
    or?: Array<ModelAppDataFilterInput | null> | null;
    not?: ModelAppDataFilterInput | null;
};
export declare type ModelIDInput = {
    ne?: string | null;
    eq?: string | null;
    le?: string | null;
    lt?: string | null;
    ge?: string | null;
    gt?: string | null;
    contains?: string | null;
    notContains?: string | null;
    between?: Array<string | null> | null;
    beginsWith?: string | null;
    attributeExists?: boolean | null;
    attributeType?: ModelAttributeTypes | null;
    size?: ModelSizeInput | null;
};
export declare type ModelAppDataConnection = {
    __typename: "ModelAppDataConnection";
    items: Array<AppData | null>;
    nextToken?: string | null;
};
export declare type PatchTransunionMutation = {
    __typename: "Transunion";
    authenticated?: boolean | null;
    authenticatedOn?: string | null;
    indicativeEnrichmentSuccess?: boolean | null;
    indicativeEnrichmentStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
    } | null;
    getAuthenticationQuestionsSuccess?: boolean | null;
    getAuthenticationQuestionsStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
    } | null;
    verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
    verifyAuthenticationQuestionsOTPStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
    } | null;
    verifyAuthenticationQuestionsKBASuccess?: boolean | null;
    verifyAuthenticationQuestionsKBAStatus?: {
        __typename: "TUStatusRef";
        id?: string | null;
        status?: string | null;
        statusDescription?: string | null;
        statusModifiedOn?: string | null;
        statusCode?: string | null;
    } | null;
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
    enrollReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
    } | null;
    enrollMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
    } | null;
    enrollVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
    } | null;
    enrolled?: boolean | null;
    enrolledOn?: string | null;
    fulfillReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
    } | null;
    fulfillMergeReport?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
    } | null;
    fulfillVantageScore?: {
        __typename: "TUReportResponse";
        bureau?: string | null;
        errorResponse?: string | null;
        serviceProduct?: string | null;
        serviceProductFullfillmentKey?: string | null;
        serviceProductObject?: string | null;
        serviceProductTypeId?: string | null;
        serviceProductValue?: string | null;
        status?: string | null;
    } | null;
    fulfilledOn?: string | null;
    acknowledgedDisputeTerms?: boolean | null;
    acknowledgedDisputeTermsOn?: string | null;
    disputeServiceBundleFulfillmentKey?: string | null;
    disputeEnrollmentKey?: string | null;
    disputeEnrolled?: boolean | null;
    disputeEnrolledOn?: string | null;
};
export declare type CreateAppDataMutation = {
    __typename: "AppData";
    id: string;
    user: {
        __typename: "User";
        id: string;
        userAttributes?: {
            __typename: "UserAttributes";
            name?: {
                __typename: "Name";
                first: string;
                middle?: string | null;
                last: string;
            } | null;
            address?: {
                __typename: "Address";
                addressOne: string;
                addressTwo?: string | null;
                city: string;
                state: string;
                zip: string;
            } | null;
            phone?: {
                __typename: "Phone";
                primary: string;
            } | null;
            dob?: {
                __typename: "Dob";
                year: string;
                month: string;
                day: string;
            } | null;
            ssn?: {
                __typename: "Ssn";
                lastfour: string;
                full?: string | null;
            } | null;
        } | null;
        onboarding?: {
            __typename: "Onboarding";
            lastActive: number;
            lastComplete: number;
            started?: boolean | null;
            abandoned?: boolean | null;
            display?: Array<{
                __typename: "OnboardingStep";
                id?: number | null;
                active?: boolean | null;
                complete?: boolean | null;
                name?: string | null;
            } | null> | null;
        } | null;
    };
    agencies: {
        __typename: "Agencies";
        transunion?: {
            __typename: "Transunion";
            authenticated?: boolean | null;
            authenticatedOn?: string | null;
            indicativeEnrichmentSuccess?: boolean | null;
            indicativeEnrichmentStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            getAuthenticationQuestionsSuccess?: boolean | null;
            getAuthenticationQuestionsStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
            verifyAuthenticationQuestionsOTPStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsKBASuccess?: boolean | null;
            verifyAuthenticationQuestionsKBAStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
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
            enrollReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrolled?: boolean | null;
            enrolledOn?: string | null;
            fulfillReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfilledOn?: string | null;
            acknowledgedDisputeTerms?: boolean | null;
            acknowledgedDisputeTermsOn?: string | null;
            disputeServiceBundleFulfillmentKey?: string | null;
            disputeEnrollmentKey?: string | null;
            disputeEnrolled?: boolean | null;
            disputeEnrolledOn?: string | null;
        } | null;
        equifax?: {
            __typename: "Equifax";
            authenticated?: boolean | null;
        } | null;
        experian?: {
            __typename: "Experian";
            authenticated?: boolean | null;
        } | null;
    };
    preferences: {
        __typename: "Preferences";
        showAllAccounts?: {
            __typename: "ShowAccountsPreference";
            creditCards?: boolean | null;
            collectionsAccounts?: boolean | null;
            installmentLoans?: boolean | null;
            mortgages?: boolean | null;
        } | null;
    };
    dashboard?: {
        __typename: "Dashboard";
        isLoaded?: boolean | null;
        negativeFlagged?: boolean | null;
        negativeCardCount?: number | null;
        negativeCardStatus?: string | null;
        negativeReviewed?: boolean | null;
        negativeStatus?: string | null;
        forbearanceFlagged?: boolean | null;
        forbearanceCardStatus?: string | null;
        forbearanceReviewed?: boolean | null;
        forbearanceStatus?: string | null;
        databreachFlagged?: boolean | null;
        databreachCards?: Array<{
            __typename: "DataBreachCard";
            reason?: string | null;
            reviewed?: boolean | null;
            condition?: string | null;
            subscriber?: string | null;
            paragraphs?: Array<string | null> | null;
        } | null> | null;
        databreachCardStatus?: string | null;
        databreachReviewed?: boolean | null;
        databreachStatus?: string | null;
    } | null;
    navBar?: {
        __typename: "NavBar";
        home?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        report?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        disputes?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        settings?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
    } | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
export declare type UpdateAppDataMutation = {
    __typename: "AppData";
    id: string;
    user: {
        __typename: "User";
        id: string;
        userAttributes?: {
            __typename: "UserAttributes";
            name?: {
                __typename: "Name";
                first: string;
                middle?: string | null;
                last: string;
            } | null;
            address?: {
                __typename: "Address";
                addressOne: string;
                addressTwo?: string | null;
                city: string;
                state: string;
                zip: string;
            } | null;
            phone?: {
                __typename: "Phone";
                primary: string;
            } | null;
            dob?: {
                __typename: "Dob";
                year: string;
                month: string;
                day: string;
            } | null;
            ssn?: {
                __typename: "Ssn";
                lastfour: string;
                full?: string | null;
            } | null;
        } | null;
        onboarding?: {
            __typename: "Onboarding";
            lastActive: number;
            lastComplete: number;
            started?: boolean | null;
            abandoned?: boolean | null;
            display?: Array<{
                __typename: "OnboardingStep";
                id?: number | null;
                active?: boolean | null;
                complete?: boolean | null;
                name?: string | null;
            } | null> | null;
        } | null;
    };
    agencies: {
        __typename: "Agencies";
        transunion?: {
            __typename: "Transunion";
            authenticated?: boolean | null;
            authenticatedOn?: string | null;
            indicativeEnrichmentSuccess?: boolean | null;
            indicativeEnrichmentStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            getAuthenticationQuestionsSuccess?: boolean | null;
            getAuthenticationQuestionsStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
            verifyAuthenticationQuestionsOTPStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsKBASuccess?: boolean | null;
            verifyAuthenticationQuestionsKBAStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
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
            enrollReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrolled?: boolean | null;
            enrolledOn?: string | null;
            fulfillReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfilledOn?: string | null;
            acknowledgedDisputeTerms?: boolean | null;
            acknowledgedDisputeTermsOn?: string | null;
            disputeServiceBundleFulfillmentKey?: string | null;
            disputeEnrollmentKey?: string | null;
            disputeEnrolled?: boolean | null;
            disputeEnrolledOn?: string | null;
        } | null;
        equifax?: {
            __typename: "Equifax";
            authenticated?: boolean | null;
        } | null;
        experian?: {
            __typename: "Experian";
            authenticated?: boolean | null;
        } | null;
    };
    preferences: {
        __typename: "Preferences";
        showAllAccounts?: {
            __typename: "ShowAccountsPreference";
            creditCards?: boolean | null;
            collectionsAccounts?: boolean | null;
            installmentLoans?: boolean | null;
            mortgages?: boolean | null;
        } | null;
    };
    dashboard?: {
        __typename: "Dashboard";
        isLoaded?: boolean | null;
        negativeFlagged?: boolean | null;
        negativeCardCount?: number | null;
        negativeCardStatus?: string | null;
        negativeReviewed?: boolean | null;
        negativeStatus?: string | null;
        forbearanceFlagged?: boolean | null;
        forbearanceCardStatus?: string | null;
        forbearanceReviewed?: boolean | null;
        forbearanceStatus?: string | null;
        databreachFlagged?: boolean | null;
        databreachCards?: Array<{
            __typename: "DataBreachCard";
            reason?: string | null;
            reviewed?: boolean | null;
            condition?: string | null;
            subscriber?: string | null;
            paragraphs?: Array<string | null> | null;
        } | null> | null;
        databreachCardStatus?: string | null;
        databreachReviewed?: boolean | null;
        databreachStatus?: string | null;
    } | null;
    navBar?: {
        __typename: "NavBar";
        home?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        report?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        disputes?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        settings?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
    } | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
export declare type DeleteAppDataMutation = {
    __typename: "AppData";
    id: string;
    user: {
        __typename: "User";
        id: string;
        userAttributes?: {
            __typename: "UserAttributes";
            name?: {
                __typename: "Name";
                first: string;
                middle?: string | null;
                last: string;
            } | null;
            address?: {
                __typename: "Address";
                addressOne: string;
                addressTwo?: string | null;
                city: string;
                state: string;
                zip: string;
            } | null;
            phone?: {
                __typename: "Phone";
                primary: string;
            } | null;
            dob?: {
                __typename: "Dob";
                year: string;
                month: string;
                day: string;
            } | null;
            ssn?: {
                __typename: "Ssn";
                lastfour: string;
                full?: string | null;
            } | null;
        } | null;
        onboarding?: {
            __typename: "Onboarding";
            lastActive: number;
            lastComplete: number;
            started?: boolean | null;
            abandoned?: boolean | null;
            display?: Array<{
                __typename: "OnboardingStep";
                id?: number | null;
                active?: boolean | null;
                complete?: boolean | null;
                name?: string | null;
            } | null> | null;
        } | null;
    };
    agencies: {
        __typename: "Agencies";
        transunion?: {
            __typename: "Transunion";
            authenticated?: boolean | null;
            authenticatedOn?: string | null;
            indicativeEnrichmentSuccess?: boolean | null;
            indicativeEnrichmentStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            getAuthenticationQuestionsSuccess?: boolean | null;
            getAuthenticationQuestionsStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
            verifyAuthenticationQuestionsOTPStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsKBASuccess?: boolean | null;
            verifyAuthenticationQuestionsKBAStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
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
            enrollReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrolled?: boolean | null;
            enrolledOn?: string | null;
            fulfillReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfilledOn?: string | null;
            acknowledgedDisputeTerms?: boolean | null;
            acknowledgedDisputeTermsOn?: string | null;
            disputeServiceBundleFulfillmentKey?: string | null;
            disputeEnrollmentKey?: string | null;
            disputeEnrolled?: boolean | null;
            disputeEnrolledOn?: string | null;
        } | null;
        equifax?: {
            __typename: "Equifax";
            authenticated?: boolean | null;
        } | null;
        experian?: {
            __typename: "Experian";
            authenticated?: boolean | null;
        } | null;
    };
    preferences: {
        __typename: "Preferences";
        showAllAccounts?: {
            __typename: "ShowAccountsPreference";
            creditCards?: boolean | null;
            collectionsAccounts?: boolean | null;
            installmentLoans?: boolean | null;
            mortgages?: boolean | null;
        } | null;
    };
    dashboard?: {
        __typename: "Dashboard";
        isLoaded?: boolean | null;
        negativeFlagged?: boolean | null;
        negativeCardCount?: number | null;
        negativeCardStatus?: string | null;
        negativeReviewed?: boolean | null;
        negativeStatus?: string | null;
        forbearanceFlagged?: boolean | null;
        forbearanceCardStatus?: string | null;
        forbearanceReviewed?: boolean | null;
        forbearanceStatus?: string | null;
        databreachFlagged?: boolean | null;
        databreachCards?: Array<{
            __typename: "DataBreachCard";
            reason?: string | null;
            reviewed?: boolean | null;
            condition?: string | null;
            subscriber?: string | null;
            paragraphs?: Array<string | null> | null;
        } | null> | null;
        databreachCardStatus?: string | null;
        databreachReviewed?: boolean | null;
        databreachStatus?: string | null;
    } | null;
    navBar?: {
        __typename: "NavBar";
        home?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        report?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        disputes?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        settings?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
    } | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
export declare type GetAppDataQuery = {
    __typename: "AppData";
    id: string;
    user: {
        __typename: "User";
        id: string;
        userAttributes?: {
            __typename: "UserAttributes";
            name?: {
                __typename: "Name";
                first: string;
                middle?: string | null;
                last: string;
            } | null;
            address?: {
                __typename: "Address";
                addressOne: string;
                addressTwo?: string | null;
                city: string;
                state: string;
                zip: string;
            } | null;
            phone?: {
                __typename: "Phone";
                primary: string;
            } | null;
            dob?: {
                __typename: "Dob";
                year: string;
                month: string;
                day: string;
            } | null;
            ssn?: {
                __typename: "Ssn";
                lastfour: string;
                full?: string | null;
            } | null;
        } | null;
        onboarding?: {
            __typename: "Onboarding";
            lastActive: number;
            lastComplete: number;
            started?: boolean | null;
            abandoned?: boolean | null;
            display?: Array<{
                __typename: "OnboardingStep";
                id?: number | null;
                active?: boolean | null;
                complete?: boolean | null;
                name?: string | null;
            } | null> | null;
        } | null;
    };
    agencies: {
        __typename: "Agencies";
        transunion?: {
            __typename: "Transunion";
            authenticated?: boolean | null;
            authenticatedOn?: string | null;
            indicativeEnrichmentSuccess?: boolean | null;
            indicativeEnrichmentStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            getAuthenticationQuestionsSuccess?: boolean | null;
            getAuthenticationQuestionsStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
            verifyAuthenticationQuestionsOTPStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsKBASuccess?: boolean | null;
            verifyAuthenticationQuestionsKBAStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
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
            enrollReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrolled?: boolean | null;
            enrolledOn?: string | null;
            fulfillReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfilledOn?: string | null;
            acknowledgedDisputeTerms?: boolean | null;
            acknowledgedDisputeTermsOn?: string | null;
            disputeServiceBundleFulfillmentKey?: string | null;
            disputeEnrollmentKey?: string | null;
            disputeEnrolled?: boolean | null;
            disputeEnrolledOn?: string | null;
        } | null;
        equifax?: {
            __typename: "Equifax";
            authenticated?: boolean | null;
        } | null;
        experian?: {
            __typename: "Experian";
            authenticated?: boolean | null;
        } | null;
    };
    preferences: {
        __typename: "Preferences";
        showAllAccounts?: {
            __typename: "ShowAccountsPreference";
            creditCards?: boolean | null;
            collectionsAccounts?: boolean | null;
            installmentLoans?: boolean | null;
            mortgages?: boolean | null;
        } | null;
    };
    dashboard?: {
        __typename: "Dashboard";
        isLoaded?: boolean | null;
        negativeFlagged?: boolean | null;
        negativeCardCount?: number | null;
        negativeCardStatus?: string | null;
        negativeReviewed?: boolean | null;
        negativeStatus?: string | null;
        forbearanceFlagged?: boolean | null;
        forbearanceCardStatus?: string | null;
        forbearanceReviewed?: boolean | null;
        forbearanceStatus?: string | null;
        databreachFlagged?: boolean | null;
        databreachCards?: Array<{
            __typename: "DataBreachCard";
            reason?: string | null;
            reviewed?: boolean | null;
            condition?: string | null;
            subscriber?: string | null;
            paragraphs?: Array<string | null> | null;
        } | null> | null;
        databreachCardStatus?: string | null;
        databreachReviewed?: boolean | null;
        databreachStatus?: string | null;
    } | null;
    navBar?: {
        __typename: "NavBar";
        home?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        report?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        disputes?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        settings?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
    } | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
export declare type ListAppDatasQuery = {
    __typename: "ModelAppDataConnection";
    items: Array<{
        __typename: "AppData";
        id: string;
        user: {
            __typename: "User";
            id: string;
            userAttributes?: {
                __typename: "UserAttributes";
                name?: {
                    __typename: "Name";
                    first: string;
                    middle?: string | null;
                    last: string;
                } | null;
                address?: {
                    __typename: "Address";
                    addressOne: string;
                    addressTwo?: string | null;
                    city: string;
                    state: string;
                    zip: string;
                } | null;
                phone?: {
                    __typename: "Phone";
                    primary: string;
                } | null;
                dob?: {
                    __typename: "Dob";
                    year: string;
                    month: string;
                    day: string;
                } | null;
                ssn?: {
                    __typename: "Ssn";
                    lastfour: string;
                    full?: string | null;
                } | null;
            } | null;
            onboarding?: {
                __typename: "Onboarding";
                lastActive: number;
                lastComplete: number;
                started?: boolean | null;
                abandoned?: boolean | null;
                display?: Array<{
                    __typename: "OnboardingStep";
                    id?: number | null;
                    active?: boolean | null;
                    complete?: boolean | null;
                    name?: string | null;
                } | null> | null;
            } | null;
        };
        agencies: {
            __typename: "Agencies";
            transunion?: {
                __typename: "Transunion";
                authenticated?: boolean | null;
                authenticatedOn?: string | null;
                indicativeEnrichmentSuccess?: boolean | null;
                indicativeEnrichmentStatus?: {
                    __typename: "TUStatusRef";
                    id?: string | null;
                    status?: string | null;
                    statusDescription?: string | null;
                    statusModifiedOn?: string | null;
                    statusCode?: string | null;
                } | null;
                getAuthenticationQuestionsSuccess?: boolean | null;
                getAuthenticationQuestionsStatus?: {
                    __typename: "TUStatusRef";
                    id?: string | null;
                    status?: string | null;
                    statusDescription?: string | null;
                    statusModifiedOn?: string | null;
                    statusCode?: string | null;
                } | null;
                verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
                verifyAuthenticationQuestionsOTPStatus?: {
                    __typename: "TUStatusRef";
                    id?: string | null;
                    status?: string | null;
                    statusDescription?: string | null;
                    statusModifiedOn?: string | null;
                    statusCode?: string | null;
                } | null;
                verifyAuthenticationQuestionsKBASuccess?: boolean | null;
                verifyAuthenticationQuestionsKBAStatus?: {
                    __typename: "TUStatusRef";
                    id?: string | null;
                    status?: string | null;
                    statusDescription?: string | null;
                    statusModifiedOn?: string | null;
                    statusCode?: string | null;
                } | null;
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
                enrollReport?: {
                    __typename: "TUReportResponse";
                    bureau?: string | null;
                    errorResponse?: string | null;
                    serviceProduct?: string | null;
                    serviceProductFullfillmentKey?: string | null;
                    serviceProductObject?: string | null;
                    serviceProductTypeId?: string | null;
                    serviceProductValue?: string | null;
                    status?: string | null;
                } | null;
                enrollMergeReport?: {
                    __typename: "TUReportResponse";
                    bureau?: string | null;
                    errorResponse?: string | null;
                    serviceProduct?: string | null;
                    serviceProductFullfillmentKey?: string | null;
                    serviceProductObject?: string | null;
                    serviceProductTypeId?: string | null;
                    serviceProductValue?: string | null;
                    status?: string | null;
                } | null;
                enrollVantageScore?: {
                    __typename: "TUReportResponse";
                    bureau?: string | null;
                    errorResponse?: string | null;
                    serviceProduct?: string | null;
                    serviceProductFullfillmentKey?: string | null;
                    serviceProductObject?: string | null;
                    serviceProductTypeId?: string | null;
                    serviceProductValue?: string | null;
                    status?: string | null;
                } | null;
                enrolled?: boolean | null;
                enrolledOn?: string | null;
                fulfillReport?: {
                    __typename: "TUReportResponse";
                    bureau?: string | null;
                    errorResponse?: string | null;
                    serviceProduct?: string | null;
                    serviceProductFullfillmentKey?: string | null;
                    serviceProductObject?: string | null;
                    serviceProductTypeId?: string | null;
                    serviceProductValue?: string | null;
                    status?: string | null;
                } | null;
                fulfillMergeReport?: {
                    __typename: "TUReportResponse";
                    bureau?: string | null;
                    errorResponse?: string | null;
                    serviceProduct?: string | null;
                    serviceProductFullfillmentKey?: string | null;
                    serviceProductObject?: string | null;
                    serviceProductTypeId?: string | null;
                    serviceProductValue?: string | null;
                    status?: string | null;
                } | null;
                fulfillVantageScore?: {
                    __typename: "TUReportResponse";
                    bureau?: string | null;
                    errorResponse?: string | null;
                    serviceProduct?: string | null;
                    serviceProductFullfillmentKey?: string | null;
                    serviceProductObject?: string | null;
                    serviceProductTypeId?: string | null;
                    serviceProductValue?: string | null;
                    status?: string | null;
                } | null;
                fulfilledOn?: string | null;
                acknowledgedDisputeTerms?: boolean | null;
                acknowledgedDisputeTermsOn?: string | null;
                disputeServiceBundleFulfillmentKey?: string | null;
                disputeEnrollmentKey?: string | null;
                disputeEnrolled?: boolean | null;
                disputeEnrolledOn?: string | null;
            } | null;
            equifax?: {
                __typename: "Equifax";
                authenticated?: boolean | null;
            } | null;
            experian?: {
                __typename: "Experian";
                authenticated?: boolean | null;
            } | null;
        };
        preferences: {
            __typename: "Preferences";
            showAllAccounts?: {
                __typename: "ShowAccountsPreference";
                creditCards?: boolean | null;
                collectionsAccounts?: boolean | null;
                installmentLoans?: boolean | null;
                mortgages?: boolean | null;
            } | null;
        };
        dashboard?: {
            __typename: "Dashboard";
            isLoaded?: boolean | null;
            negativeFlagged?: boolean | null;
            negativeCardCount?: number | null;
            negativeCardStatus?: string | null;
            negativeReviewed?: boolean | null;
            negativeStatus?: string | null;
            forbearanceFlagged?: boolean | null;
            forbearanceCardStatus?: string | null;
            forbearanceReviewed?: boolean | null;
            forbearanceStatus?: string | null;
            databreachFlagged?: boolean | null;
            databreachCards?: Array<{
                __typename: "DataBreachCard";
                reason?: string | null;
                reviewed?: boolean | null;
                condition?: string | null;
                subscriber?: string | null;
                paragraphs?: Array<string | null> | null;
            } | null> | null;
            databreachCardStatus?: string | null;
            databreachReviewed?: boolean | null;
            databreachStatus?: string | null;
        } | null;
        navBar?: {
            __typename: "NavBar";
            home?: {
                __typename: "NavBarConfig";
                badge?: boolean | null;
            } | null;
            report?: {
                __typename: "NavBarConfig";
                badge?: boolean | null;
            } | null;
            disputes?: {
                __typename: "NavBarConfig";
                badge?: boolean | null;
            } | null;
            settings?: {
                __typename: "NavBarConfig";
                badge?: boolean | null;
            } | null;
        } | null;
        status?: string | null;
        statusReason?: string | null;
        statusReasonDescription?: string | null;
        lastStatusModifiedOn?: string | null;
        nextStatusModifiedOn?: string | null;
        isLoaded?: boolean | null;
        createdAt: string;
        updatedAt: string;
        owner?: string | null;
    } | null>;
    nextToken?: string | null;
};
export declare type OnCreateAppDataSubscription = {
    __typename: "AppData";
    id: string;
    user: {
        __typename: "User";
        id: string;
        userAttributes?: {
            __typename: "UserAttributes";
            name?: {
                __typename: "Name";
                first: string;
                middle?: string | null;
                last: string;
            } | null;
            address?: {
                __typename: "Address";
                addressOne: string;
                addressTwo?: string | null;
                city: string;
                state: string;
                zip: string;
            } | null;
            phone?: {
                __typename: "Phone";
                primary: string;
            } | null;
            dob?: {
                __typename: "Dob";
                year: string;
                month: string;
                day: string;
            } | null;
            ssn?: {
                __typename: "Ssn";
                lastfour: string;
                full?: string | null;
            } | null;
        } | null;
        onboarding?: {
            __typename: "Onboarding";
            lastActive: number;
            lastComplete: number;
            started?: boolean | null;
            abandoned?: boolean | null;
            display?: Array<{
                __typename: "OnboardingStep";
                id?: number | null;
                active?: boolean | null;
                complete?: boolean | null;
                name?: string | null;
            } | null> | null;
        } | null;
    };
    agencies: {
        __typename: "Agencies";
        transunion?: {
            __typename: "Transunion";
            authenticated?: boolean | null;
            authenticatedOn?: string | null;
            indicativeEnrichmentSuccess?: boolean | null;
            indicativeEnrichmentStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            getAuthenticationQuestionsSuccess?: boolean | null;
            getAuthenticationQuestionsStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
            verifyAuthenticationQuestionsOTPStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsKBASuccess?: boolean | null;
            verifyAuthenticationQuestionsKBAStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
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
            enrollReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrolled?: boolean | null;
            enrolledOn?: string | null;
            fulfillReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfilledOn?: string | null;
            acknowledgedDisputeTerms?: boolean | null;
            acknowledgedDisputeTermsOn?: string | null;
            disputeServiceBundleFulfillmentKey?: string | null;
            disputeEnrollmentKey?: string | null;
            disputeEnrolled?: boolean | null;
            disputeEnrolledOn?: string | null;
        } | null;
        equifax?: {
            __typename: "Equifax";
            authenticated?: boolean | null;
        } | null;
        experian?: {
            __typename: "Experian";
            authenticated?: boolean | null;
        } | null;
    };
    preferences: {
        __typename: "Preferences";
        showAllAccounts?: {
            __typename: "ShowAccountsPreference";
            creditCards?: boolean | null;
            collectionsAccounts?: boolean | null;
            installmentLoans?: boolean | null;
            mortgages?: boolean | null;
        } | null;
    };
    dashboard?: {
        __typename: "Dashboard";
        isLoaded?: boolean | null;
        negativeFlagged?: boolean | null;
        negativeCardCount?: number | null;
        negativeCardStatus?: string | null;
        negativeReviewed?: boolean | null;
        negativeStatus?: string | null;
        forbearanceFlagged?: boolean | null;
        forbearanceCardStatus?: string | null;
        forbearanceReviewed?: boolean | null;
        forbearanceStatus?: string | null;
        databreachFlagged?: boolean | null;
        databreachCards?: Array<{
            __typename: "DataBreachCard";
            reason?: string | null;
            reviewed?: boolean | null;
            condition?: string | null;
            subscriber?: string | null;
            paragraphs?: Array<string | null> | null;
        } | null> | null;
        databreachCardStatus?: string | null;
        databreachReviewed?: boolean | null;
        databreachStatus?: string | null;
    } | null;
    navBar?: {
        __typename: "NavBar";
        home?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        report?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        disputes?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        settings?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
    } | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
export declare type OnUpdateAppDataSubscription = {
    __typename: "AppData";
    id: string;
    user: {
        __typename: "User";
        id: string;
        userAttributes?: {
            __typename: "UserAttributes";
            name?: {
                __typename: "Name";
                first: string;
                middle?: string | null;
                last: string;
            } | null;
            address?: {
                __typename: "Address";
                addressOne: string;
                addressTwo?: string | null;
                city: string;
                state: string;
                zip: string;
            } | null;
            phone?: {
                __typename: "Phone";
                primary: string;
            } | null;
            dob?: {
                __typename: "Dob";
                year: string;
                month: string;
                day: string;
            } | null;
            ssn?: {
                __typename: "Ssn";
                lastfour: string;
                full?: string | null;
            } | null;
        } | null;
        onboarding?: {
            __typename: "Onboarding";
            lastActive: number;
            lastComplete: number;
            started?: boolean | null;
            abandoned?: boolean | null;
            display?: Array<{
                __typename: "OnboardingStep";
                id?: number | null;
                active?: boolean | null;
                complete?: boolean | null;
                name?: string | null;
            } | null> | null;
        } | null;
    };
    agencies: {
        __typename: "Agencies";
        transunion?: {
            __typename: "Transunion";
            authenticated?: boolean | null;
            authenticatedOn?: string | null;
            indicativeEnrichmentSuccess?: boolean | null;
            indicativeEnrichmentStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            getAuthenticationQuestionsSuccess?: boolean | null;
            getAuthenticationQuestionsStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
            verifyAuthenticationQuestionsOTPStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsKBASuccess?: boolean | null;
            verifyAuthenticationQuestionsKBAStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
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
            enrollReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrolled?: boolean | null;
            enrolledOn?: string | null;
            fulfillReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfilledOn?: string | null;
            acknowledgedDisputeTerms?: boolean | null;
            acknowledgedDisputeTermsOn?: string | null;
            disputeServiceBundleFulfillmentKey?: string | null;
            disputeEnrollmentKey?: string | null;
            disputeEnrolled?: boolean | null;
            disputeEnrolledOn?: string | null;
        } | null;
        equifax?: {
            __typename: "Equifax";
            authenticated?: boolean | null;
        } | null;
        experian?: {
            __typename: "Experian";
            authenticated?: boolean | null;
        } | null;
    };
    preferences: {
        __typename: "Preferences";
        showAllAccounts?: {
            __typename: "ShowAccountsPreference";
            creditCards?: boolean | null;
            collectionsAccounts?: boolean | null;
            installmentLoans?: boolean | null;
            mortgages?: boolean | null;
        } | null;
    };
    dashboard?: {
        __typename: "Dashboard";
        isLoaded?: boolean | null;
        negativeFlagged?: boolean | null;
        negativeCardCount?: number | null;
        negativeCardStatus?: string | null;
        negativeReviewed?: boolean | null;
        negativeStatus?: string | null;
        forbearanceFlagged?: boolean | null;
        forbearanceCardStatus?: string | null;
        forbearanceReviewed?: boolean | null;
        forbearanceStatus?: string | null;
        databreachFlagged?: boolean | null;
        databreachCards?: Array<{
            __typename: "DataBreachCard";
            reason?: string | null;
            reviewed?: boolean | null;
            condition?: string | null;
            subscriber?: string | null;
            paragraphs?: Array<string | null> | null;
        } | null> | null;
        databreachCardStatus?: string | null;
        databreachReviewed?: boolean | null;
        databreachStatus?: string | null;
    } | null;
    navBar?: {
        __typename: "NavBar";
        home?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        report?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        disputes?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        settings?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
    } | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
export declare type OnDeleteAppDataSubscription = {
    __typename: "AppData";
    id: string;
    user: {
        __typename: "User";
        id: string;
        userAttributes?: {
            __typename: "UserAttributes";
            name?: {
                __typename: "Name";
                first: string;
                middle?: string | null;
                last: string;
            } | null;
            address?: {
                __typename: "Address";
                addressOne: string;
                addressTwo?: string | null;
                city: string;
                state: string;
                zip: string;
            } | null;
            phone?: {
                __typename: "Phone";
                primary: string;
            } | null;
            dob?: {
                __typename: "Dob";
                year: string;
                month: string;
                day: string;
            } | null;
            ssn?: {
                __typename: "Ssn";
                lastfour: string;
                full?: string | null;
            } | null;
        } | null;
        onboarding?: {
            __typename: "Onboarding";
            lastActive: number;
            lastComplete: number;
            started?: boolean | null;
            abandoned?: boolean | null;
            display?: Array<{
                __typename: "OnboardingStep";
                id?: number | null;
                active?: boolean | null;
                complete?: boolean | null;
                name?: string | null;
            } | null> | null;
        } | null;
    };
    agencies: {
        __typename: "Agencies";
        transunion?: {
            __typename: "Transunion";
            authenticated?: boolean | null;
            authenticatedOn?: string | null;
            indicativeEnrichmentSuccess?: boolean | null;
            indicativeEnrichmentStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            getAuthenticationQuestionsSuccess?: boolean | null;
            getAuthenticationQuestionsStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsOTPSuccess?: boolean | null;
            verifyAuthenticationQuestionsOTPStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
            verifyAuthenticationQuestionsKBASuccess?: boolean | null;
            verifyAuthenticationQuestionsKBAStatus?: {
                __typename: "TUStatusRef";
                id?: string | null;
                status?: string | null;
                statusDescription?: string | null;
                statusModifiedOn?: string | null;
                statusCode?: string | null;
            } | null;
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
            enrollReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrollVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            enrolled?: boolean | null;
            enrolledOn?: string | null;
            fulfillReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillMergeReport?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfillVantageScore?: {
                __typename: "TUReportResponse";
                bureau?: string | null;
                errorResponse?: string | null;
                serviceProduct?: string | null;
                serviceProductFullfillmentKey?: string | null;
                serviceProductObject?: string | null;
                serviceProductTypeId?: string | null;
                serviceProductValue?: string | null;
                status?: string | null;
            } | null;
            fulfilledOn?: string | null;
            acknowledgedDisputeTerms?: boolean | null;
            acknowledgedDisputeTermsOn?: string | null;
            disputeServiceBundleFulfillmentKey?: string | null;
            disputeEnrollmentKey?: string | null;
            disputeEnrolled?: boolean | null;
            disputeEnrolledOn?: string | null;
        } | null;
        equifax?: {
            __typename: "Equifax";
            authenticated?: boolean | null;
        } | null;
        experian?: {
            __typename: "Experian";
            authenticated?: boolean | null;
        } | null;
    };
    preferences: {
        __typename: "Preferences";
        showAllAccounts?: {
            __typename: "ShowAccountsPreference";
            creditCards?: boolean | null;
            collectionsAccounts?: boolean | null;
            installmentLoans?: boolean | null;
            mortgages?: boolean | null;
        } | null;
    };
    dashboard?: {
        __typename: "Dashboard";
        isLoaded?: boolean | null;
        negativeFlagged?: boolean | null;
        negativeCardCount?: number | null;
        negativeCardStatus?: string | null;
        negativeReviewed?: boolean | null;
        negativeStatus?: string | null;
        forbearanceFlagged?: boolean | null;
        forbearanceCardStatus?: string | null;
        forbearanceReviewed?: boolean | null;
        forbearanceStatus?: string | null;
        databreachFlagged?: boolean | null;
        databreachCards?: Array<{
            __typename: "DataBreachCard";
            reason?: string | null;
            reviewed?: boolean | null;
            condition?: string | null;
            subscriber?: string | null;
            paragraphs?: Array<string | null> | null;
        } | null> | null;
        databreachCardStatus?: string | null;
        databreachReviewed?: boolean | null;
        databreachStatus?: string | null;
    } | null;
    navBar?: {
        __typename: "NavBar";
        home?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        report?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        disputes?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
        settings?: {
            __typename: "NavBarConfig";
            badge?: boolean | null;
        } | null;
    } | null;
    status?: string | null;
    statusReason?: string | null;
    statusReasonDescription?: string | null;
    lastStatusModifiedOn?: string | null;
    nextStatusModifiedOn?: string | null;
    isLoaded?: boolean | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
};
