import { useSettings } from "@/game/SettingsContext";
import { useLiveTranslate } from "@/lib/i18nLive";

/**
 * Renders a translated string that reacts to the current language.
 * Use for hardcoded English text inside story/case components.
 */
const T = ({ children }: { children?: string | null }) => {
  const { lang } = useSettings();
  const out = useLiveTranslate(children ?? "", lang);
  return <>{out}</>;
};

export default T;

/** Hook helper for cases where you need a string (not a component). */
export const useT = (text: string | undefined) => {
  const { lang } = useSettings();
  return useLiveTranslate(text ?? "", lang);
};
