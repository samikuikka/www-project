import { useRouter } from "next/router";
import { useCallback } from "react";

export const useQueryString = () => {
  const router = useRouter();

  const createQueryString = useCallback(
    (key: string, value: string) => {
      const oldParams = router.query as Record<string, string>;
      const params = new URLSearchParams(oldParams);
      params.set(key, value);
      return params.toString();
    },
    [router.query],
  );

  return { createQueryString };
};
