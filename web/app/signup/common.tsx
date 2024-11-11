export type Caller = "registration" | "configMenu";
export type StepProps<T> = {
  onSave: (t: T) => void;
  prev?: T;
  caller: Caller;
};

export type BackProp = {
  back: () => void;
};

export function NextButton({
  onClick,
  weak,
  children,
}: {
  onClick: () => void;
  weak?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      className={`btn ${weak && "btn-primary"} ml-auto h-11 w-24 rounded-3xl`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
