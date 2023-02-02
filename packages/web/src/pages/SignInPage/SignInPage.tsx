import { useAuth } from "src/AuthProvider";
import { Content } from "src/components/Content";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";
import { LoginWithAmazon } from "src/components/LoginWithAmazon";
import { Logotype } from "src/components/Logotype";

export const SignInPage: React.FC = () => {
  const { signIn } = useAuth();

  return (
    <>
      <Header />

      <Content className="flex-column flex-1 justify-center align-center">
        <Logotype />

        <p className="text-center mt-4">
          Amazon アカウントでログインして
          <br />
          起動したいパソコンを登録しましょう！
        </p>

        <LoginWithAmazon className="mt-2" onClick={signIn} />
      </Content>

      <Footer>
        <p className="text-xs text-secondary">
          本スキルを利用するにはスキルと Amazon
          アカウントを連携させる必要があります。 詳しくは
          <a
            className="text-link"
            href="https://github.com/somq14/alexa-wake-on-lan/blob/master/PRIVACY_POLICY.md"
          >
            プライバシーポリシー
          </a>
          をご確認ください。 またアカウント連携をもって
          <a
            className="text-link"
            href="https://github.com/somq14/alexa-wake-on-lan/blob/master/TERMS_OF_USE.md"
          >
            利用規約
          </a>
          に同意したものとみなします。
        </p>
      </Footer>
    </>
  );
};
