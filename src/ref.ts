import { SetSignalOptions, Signal, SignalSetter, useSignal } from "./scope.js";

/**
 * Provide write capabilities to a signal.
 */
export interface Ref<in out T> extends Signal<T>, RefIn<T> {
  /**
   * Sets the value of the signal.
   */
  set: SignalSetter<T>;
}

/**
 * A contravariant variant of {@link Ref}.
 */
export interface RefIn<in T> {
  /**
   * Sets the value of the signal.
   */
  set: SignalSetter<T, unknown>;
}

/**
 * Creates a new signal with write capabilities.
 */
export const useRef: (<T>(value: T, opts?: SetSignalOptions) => Ref<T>) &
  (<T>(value?: T, opts?: SetSignalOptions) => Ref<T | undefined>) = <T>(
  value?: T,
  opts?: SetSignalOptions,
): Ref<T> & Ref<T | undefined> => {
  const [signal, setter] = useSignal(value, opts);
  (signal as Ref<T | undefined>).set = setter;
  return signal as Ref<T> & Ref<T | undefined>;
};
