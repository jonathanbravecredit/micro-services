// the addon processor, just needs to determine what the multiplier is going to be
// TODO

const enrollmentAddOn = (denomination: number) => {
  return denomination;
};

export class AddOnsCalculator {
  enrollment: (arg0: number) => number = enrollmentAddOn;
  constructor() {}
}
