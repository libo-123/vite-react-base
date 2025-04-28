import { useUserStore } from "@/store";

/**
 * loader前置加载器
 * 注：loader执行完后才加载路由页面，同一路径多个loader，将并行执行。
 * @returns 
 */
const AuthLoader = async () => {
    //根据用户信息，执行特定的校验或者前置工作，整理页面中的权限等。
    // 请谨慎使用，这里会被执行多次，如果是组件级别的，每次都会调用

    // 不要在非组件函数中使用 Hooks
    // 直接从 store 获取状态而不使用 hook
    const userInfo = useUserStore.getState().getUserInfo();

    const data: any = await new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                buttonList: [],
                menuList: [],
                menuPathList: [],
                userInfo: userInfo
            });
        }, 0);
    });

    
    return {
      menuList: data.userInfo
    };
  }

export default AuthLoader;