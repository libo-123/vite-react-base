import { IUserInfo } from '@/types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'


/**
 * 首页信息store示范
 */
const useHomeStore = create<{
    userInfo: IUserInfo,
    setUserInfo: (userInfo: IUserInfo) => void,
    getUserInfo: () => IUserInfo,
    clearUserInfo: () => void,
}>(
    combine(
        {
            userInfo: {} as IUserInfo,
        },
        (set, get) => {
            return {
                setUserInfo: (userInfo: IUserInfo) => {
                    set({ userInfo })
                },
                getUserInfo: () => {
                    return get().userInfo
                },
                clearUserInfo: () => {
                    set({ userInfo: {} as IUserInfo })
                }
            }
        },
    ),
)

export default useHomeStore

