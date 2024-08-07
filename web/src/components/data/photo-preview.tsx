type URL = string;
export const photo: {
  upload: (() => Promise<URL>) | null;
} = {
  upload: null,
};
