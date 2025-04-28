import { createBrowserRouter, RouteObject, RouterProvider } from "react-router-dom";
import "@/assets/styles/index.scss";
import routes from "@/routes";
import { useUserStore } from "@/store";
import { getUserInfo } from "./request/common";
import { useRequest } from "ahooks";
import { ConfigProvider } from "antd";
import { useState } from "react";
import DraggableColorPicker from "@/components/DraggableColorPicker";
import DraggableLanguageSwitcher from "@/components/DraggableLanguageSwitcher";

/**
 * 根据用户信息，过滤路由
 * @param routes
 * @returns
 */
const filterRoutes = (routes: RouteObject[]) => {
  // 这里可以根据用户useinfo接口，渲染不同的自定义routes，或者过滤等。
  return routes;
};

/**
 *  所有需要全局配置的都在这里
 * @returns
 */
const App = () => {
  const { setUserInfo } = useUserStore();
  const [primary, setPrimary] = useState("#ff553c");

  const { loading } = useRequest(getUserInfo, {
    onSuccess: res => setUserInfo(res.data),
    manual: false, //主动执行
    onError: error => {
      console.log(error);
    },
  });

  return (
    <>
      <DraggableLanguageSwitcher />
      <DraggableColorPicker defaultColor={primary} onChange={setPrimary} />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primary,
            borderRadius: 2,
          },
          components: {},
        }}>
        {loading ? null : (
          <RouterProvider
            router={createBrowserRouter(filterRoutes(routes), {
              basename: import.meta.env.VITE_ROUTER_BASE,
            })}
          />
        )}
      </ConfigProvider>
    </>
  );
};

export default App;
