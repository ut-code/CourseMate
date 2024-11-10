import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import TopNavigation from "~/components/common/TopNavigation";

export default function Contact() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex flex-col p-2">
        <TopNavigation title="お問い合わせ" />
        <div className="w-full p-8 text-left">
          <p className="mb-4 leading-7">
            ご利用いただきありがとうございます。サービスに関するご意見やバグ報告がございましたら、以下のリンクからお問い合わせください。皆様のフィードバックは、サービスの改善に役立てさせていただきます。
          </p>
          <a
            href="https://forms.gle/WvFTbsJoHjGp9Qt88"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary mt-5 w-full"
          >
            ご意見・バグ報告をする
          </a>
        </div>
      </div>
    </NavigateByAuthState>
  );
}
