import { Content } from "src/components/Content";
import { Header } from "src/components/Header";

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Header />
      <Content className="flex-1 flex-column justify-center align-center">
        <p className="text-lg">ページが見つかりません</p>
      </Content>
    </>
  );
};
