import clsx from "clsx";

import styles from "./SignInPage.module.css";

import { useAuth } from "src/AuthProvider";
import { Content } from "src/components/Content";
import { Header } from "src/components/Header";

export const SignInPage: React.FC = () => {
  const { signIn } = useAuth();

  return (
    <>
      <Header />
      <Content className="flex-column flex-1 justify-center align-center">
        <h1 className="text-xl">アレクサ、 パソコンつけて</h1>
        <button className={clsx(styles.lwaButton, "mt-3")} onClick={signIn} />
      </Content>
    </>
  );
};
