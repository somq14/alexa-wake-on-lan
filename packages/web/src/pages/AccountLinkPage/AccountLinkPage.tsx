import { FunctionComponent, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { Content } from "src/components/Content";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";
import { LoginWithAmazon } from "src/components/LoginWithAmazon";
import { Logotype } from "src/components/Logotype";

export const AccountLinkPage: FunctionComponent = () => {
  const { search } = useLocation();

  const onClick = useCallback(() => {
    const url = new URL(
      `https://${process.env["REACT_APP_COGNITO_USER_POOL_DOMAIN"] ?? ""}`
    );
    url.pathname = "/oauth2/authorize";
    url.search = search;
    window.location.href = url.toString();
  }, [search]);

  return (
    <>
      <Header />
      <Content className="flex-1 flex-column justify-center align-center">
        <Logotype />

        <p className="text-center mt-4">
          Amazon アカウントでログインして
          <br />
          スキルとアカウントを連携させましょう！
        </p>

        <LoginWithAmazon className="mt-2" onClick={onClick} />
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
