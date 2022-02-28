export interface IIpStackResponse {
  ip: string;
  hostname: string;
  type: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
  location: IIpStackLocation;
  time_zone: IIpStackTimeZone;
  currency: IIpStackCurrency;
  connection: IIpStackConnection;
  security: IIpStackSecurity;
}

export interface IIpStackLocation {
  geoname_id: number;
  capital: string;
  languages: IIpStackLanguage[];
  country_flag: string;
  country_flag_emoji: any;
  country_flag_emoji_unicode: string;
  calling_code: string;
  is_eu: boolean;
}

export interface IIpStackLanguage {
  code: string;
  name: string;
  native: string;
}

export interface IIpStackTimeZone {
  id: string;
  current_time: string;
  gmt_offset: number;
  code: string;
  is_daylight_saving: boolean;
}

export interface IIpStackCurrency {
  code: string;
  name: string;
  plural: string;
  symbol: string;
  symbol_native: string;
}

export interface IIpStackConnection {
  asn: number;
  isp: string;
}

export interface IIpStackSecurity {
  is_proxy: boolean;
  proxy_type: any;
  is_crawler: boolean;
  crawler_name: any;
  crawler_type: any;
  is_tor: boolean;
  threat_level: string;
  threat_types: any;
}

export interface IIpStackError {
  code: number;
  info: string;
}
