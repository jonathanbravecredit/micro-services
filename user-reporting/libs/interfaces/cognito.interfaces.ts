export interface IAdminGetUserData {
  Username: string;
  UserAttributes: any[];
  Name: string;
  Value: string;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  Enabled: boolean;
  UserStatus: string;
  MFAOptions: any[];
  DeliveryMedium: string;
  AttributeName: string;
  PreferredMfaSetting: string;
  UserFASettingList: string[];
}
