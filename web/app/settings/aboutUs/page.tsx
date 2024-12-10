import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { MdLanguage } from "react-icons/md";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import TopNavigation from "~/components/common/TopNavigation";

export default function AboutUs() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="relative flex flex-col p-2">
        <TopNavigation title="About Us" />
        <div className="w-full p-8">
          <h1 className="mb-2 text-left text-xl underline">
            CourseMateについて
          </h1>
          <div className="mb-6 text-left">
            大学の授業を受けている際に、一緒に受ける友達がいなくて困ったことはありませんか？
            「友達がいないから授業をサボるようになってしまった」、「過去問を共有してくれる人がいない」
            などの東大生の悩みを解決したいと思い、CourseMateは開発されました。CourseMateを使うことで
            みなさまの大学生活がより良くなれば幸いです。ぜひ知り合いの方々に広めていただければと思っています。
          </div>
          <div className="my-5">
            <a
              href="https://github.com/ut-code/CourseMate"
              target="_blank"
              rel="noreferrer"
              className="mb-4 flex"
            >
              <FaGithub className="mr-2 text-2xl" /> CourseMate の GitHub
            </a>
            <a
              href="https://x.com/course_mate"
              target="_blank"
              rel="noreferrer"
              className="mb-4 flex"
            >
              <FaXTwitter className="mr-2 text-2xl" /> CourseMate の X (旧
              Twitter)
            </a>
          </div>

          <h1 className="mb-2 text-left text-xl underline">
            ut.code();について
          </h1>
          <div className="mb-6 text-left">
            ut.code();は、2019年設立の東京大学のソフトウェアエンジニアリングコミュニティです。
            「学習」、「交流」、「開発」の三つを活動の軸としており、さまざまなアプリを開発しています。
          </div>
          <div className="mt-5">
            <a
              href="https://utcode.net"
              target="_blank"
              rel="noreferrer"
              className="mb-4 flex"
            >
              <MdLanguage className="mr-2 text-2xl" /> ut.code(); の
              ウェブサイト
            </a>
            <a
              href="https://github.com/ut-code"
              target="_blank"
              rel="noreferrer"
              className="mb-4 flex"
            >
              <FaGithub className="mr-2 text-2xl" /> ut.code(); の GitHub
            </a>

            <a
              href="https://x.com/utokyo_code"
              target="_blank"
              rel="noreferrer"
              className="mb-4 flex"
            >
              <FaXTwitter className="mr-2 text-2xl" /> ut.code(); の X (旧
              Twitter)
            </a>
          </div>
        </div>
      </div>
    </NavigateByAuthState>
  );
}
