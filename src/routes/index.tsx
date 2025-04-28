import { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layouts from "@/layouts/index";
import Loading from "@/components/Loading";
import AuthLoader from "./AnthLoader";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const LazyLoad = (Component: React.ComponentType) => (
    <Suspense fallback={<Loading />}>
        <Component />
    </Suspense>
);

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layouts />,
        loader: AuthLoader,
        // 解决控制台告警：No `HydrateFallback` element provided to render during initial hydration 
        hydrateFallbackElement:<></>,
        children: [
            {
                // 这告诉路由器在用户位于父路由的精确路径时匹配并呈现此路由，非常nice。
                index: true,
                element: LazyLoad(Home),
            },
            {
                path: 'home/:id',
                element: LazyLoad(Home),
            },
            {
                path: 'about',
                element: LazyLoad(About),
            }
        ]
    },
    {
        path: '*',
        element: LazyLoad(NotFound)
    }
]

export default routes;