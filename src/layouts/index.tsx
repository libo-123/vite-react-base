import { Outlet, useLoaderData } from "react-router-dom";
import styles from "./layouts.module.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layouts = () => {
  const menuList = useLoaderData();

  // 实测：在路由元素呈现之前向其提供数据，但是如果一条路由中有多个loader，将并行执行。
  console.log("Auth_Loader异步前置数据", menuList);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.content}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layouts