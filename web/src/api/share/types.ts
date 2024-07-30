export type Hook<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
};
