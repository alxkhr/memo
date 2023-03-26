export function generateMemoId() {
  return (
    Math.floor((Date.now() - 1679749621555) / 1000).toString(36) +
    Math.floor(Math.random() * 1679616)
      .toString(36)
      .padStart(4, "0")
  );
}
