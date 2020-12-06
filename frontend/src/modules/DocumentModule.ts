export function handleInputChange(
  ev: React.ChangeEvent<HTMLInputElement>,
  handler: (s: string) => void
) {
  handler(ev.target.value);
}

export function enterKeyPressListener(
  ev: React.KeyboardEvent,
  callback: () => void
) {
  if (ev.key == "Enter") {
    callback();
  }
}
