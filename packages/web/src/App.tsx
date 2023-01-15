import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import { DeviceListPage } from "./pages/DeviceListPage";
import { DevicePage } from "./pages/DevicePage";
import { NewDevicePage } from "./pages/NewDevicePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SignInPage } from "./pages/SignInPage";

export const App: React.FC = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn === undefined) {
    // 初期表示時、サイインイン済みかの判定中
    return <></>;
  }

  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      {isSignedIn && (
        <Route
          path="/devices/*"
          element={
            <Routes>
              <Route path="/" element={<DeviceListPage />} />
              <Route path="/new" element={<NewDevicePage />} />
              <Route path="/:id" element={<DevicePage />} />
            </Routes>
          }
        />
      )}
      <Route
        path="/"
        element={<Navigate to={isSignedIn ? "/devices" : "/sign-in"} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
