import { useEffect, useRef } from "react";

export function usePolling<T>(
  action: () => Promise<T>,
  intervalMs: number,
  onSuccess: (data: T) => void,
  onError?: (err: unknown) => void,
  enabled: boolean = true
) {
  const savedAction = useRef(action);
  const savedOnSuccess = useRef(onSuccess);
  const savedOnError = useRef(onError);

  // Remember the latest callbacks to avoid re-triggering the effect unnecessarily
  useEffect(() => {
    savedAction.current = action;
    savedOnSuccess.current = onSuccess;
    savedOnError.current = onError;
  }, [action, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    const tick = async () => {
      try {
        const result = await savedAction.current();
        if (isMounted) {
          savedOnSuccess.current(result);
        }
      } catch (err) {
        if (isMounted && savedOnError.current) {
          savedOnError.current(err);
        }
      }
    };

    const id = setInterval(tick, intervalMs);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [intervalMs, enabled]);
}
