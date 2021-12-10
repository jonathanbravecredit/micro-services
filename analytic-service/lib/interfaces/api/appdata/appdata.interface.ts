export interface IAppData {
  id: string;
  agencies: {
    transunion: {
      fulfillVantageScore: {
        serviceProductObject: {
          serviceProductValue: string | number;
        };
      };
    };
  };
}
