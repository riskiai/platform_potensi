/** Simulasi latensi jaringan supaya loading state terlihat saat development. */
export function delay(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
