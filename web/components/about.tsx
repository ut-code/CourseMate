import { GitHub, Language } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import { Button, Link } from "@mui/material";

export function About() {
  return (
    <>
      {/* FAQ comes here*/}
      <h2>Contact</h2>
      <Button
        variant="outlined"
        href="https://forms.gle/WvFTbsJoHjGp9Qt88"
        target="_blank"
      >
        ご意見・バグ報告など
      </Button>
      <h2>About Us</h2>
      <p>
        ut.code();
        は、2019年設立の東京大学のソフトウェアエンジニアリングコミュニティです。
      </p>
      <p>
        <p>
          <Link href="https://utcode.net" target="_blank">
            <Language /> ウェブサイト
          </Link>
        </p>
        <p>
          <Link href="https://github.com/ut-code" target="_blank">
            <GitHub /> ut.code(); の GitHub
          </Link>
        </p>
        <p>
          <Link href="https://x.com/utokyo_code" target="_blank">
            <XIcon /> X (旧 Twitter)
          </Link>
        </p>
      </p>
    </>
  );
}
