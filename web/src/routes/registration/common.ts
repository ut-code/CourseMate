export type StepProps<T> = {
  onSave: (t: T) => void;
  prev?: T;
};
export type BackProp = {
  back: () => void;
};
