export const diffDays = (
  toDiff: string,
  base: string = new Date().toISOString()
) => {
  const diff = new Date(base).getTime() - new Date(toDiff).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const today = () => new Date().toISOString();
