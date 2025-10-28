// Persistent state helper

export function useLocalStorage<T>(_key: string, initialValue: T) {
  // TODO: Implement localStorage hook
  return [initialValue, () => {}] as const
}
