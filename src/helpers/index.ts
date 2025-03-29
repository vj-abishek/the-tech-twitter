export const getSrc = (urls: { src: string }[]) => {
  const sizes = ['1280x', '720x', '480x', 'x720', 'x480', 'x360'];

  for (const size of sizes) {
    const url = urls.find((d) => d.src.includes(size));
    if (url) {
      return url.src;
    }
  }
}

export const parseSettings = (settings: string) => {
  const pairs = settings.split(',').map((pair) => pair.trim());

  const result = pairs.reduce((acc, pair) => {
    const [key, value] = pair.split(':').map((part) => part.trim());
    acc[key] = value;
    return acc;
  }, {});
  return result;
};
