/**
 * No-op text wrapper. The translation system was removed; this now
 * just renders its children verbatim (English only).
 */
const T = ({ children }: { children?: string | null }) => <>{children ?? ""}</>;

export default T;

/** No-op string helper kept for back-compat with existing call sites. */
export const useT = (text: string | undefined) => text ?? "";
