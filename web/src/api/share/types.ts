export type Hook<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
};
