import { useSettings } from "@/game/SettingsContext";
import Modal from "./Modal";

const TermsGate = () => {
  const { agreedTerms, acceptTerms, t, playCue } = useSettings();
  return (
    <Modal open={!agreedTerms} title={t("terms.title")} dismissible={false}>
      <div className="space-y-4 text-[13px] leading-snug text-foreground">
        <section>
          <h3 className="pixel text-[10px] text-primary mb-1">{t("terms.tos")}</h3>
          <p>{t("terms.tos_body")}</p>
        </section>
        <section>
          <h3 className="pixel text-[10px] text-primary mb-1">{t("terms.privacy")}</h3>
          <p>{t("terms.privacy_body")}</p>
        </section>
        <section>
          <h3 className="pixel text-[10px] text-primary mb-1">{t("terms.ai")}</h3>
          <p>{t("terms.ai_body")}</p>
        </section>
        <button
          onClick={() => { playCue(); acceptTerms(); }}
          className="pixel-btn w-full text-xs mt-2"
        >
          {t("terms.agree")}
        </button>
      </div>
    </Modal>
  );
};

export default TermsGate;