// the addon processor, just needs to determine what the multiplier is going to be
// TODO

const enrollmentAddOn = (denomination: number) => {
  return denomination;
};

export const AddOnsCalculator: { [key: string]: any } = {
  enrollment: enrollmentAddOn,
};
