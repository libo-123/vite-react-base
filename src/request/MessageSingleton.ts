import { message } from 'antd';
import { NoticeType } from 'antd/es/message/interface';

/**
 * 消息控制器,防止重复显示消息
 */
class MessageSingleton {
    private static instance: MessageSingleton;
    private messageInstance: any;
    private timer: NodeJS.Timeout | null;

    private constructor() {
        this.messageInstance = null;
        this.timer = null;
    }

    public static getInstance(): MessageSingleton {
        if (!MessageSingleton.instance) {
            MessageSingleton.instance = new MessageSingleton();
        }
        return MessageSingleton.instance;
    }

    showMessage(options: { messages: string; type: NoticeType; duration?: number }) {
        const { messages, type, duration = 3000 } = options;

        // 如果存在，则直接返回
        if (this.messageInstance) {
            return;
        }

        // 使用 message open 方法
        this.messageInstance = message.open({
            ...options,
            content: messages,
            type: type,
            duration: duration / 1000,
            onClose: () => {
                this.messageInstance = null;
            }
        });

        // 定时清除，防止重复触发
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.messageInstance = null;
        }, duration);
    }

    destroy() {
        if (this.messageInstance) {
            message.destroy(this.messageInstance);
            this.messageInstance = null;
        }
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}

// 创建单例实例
const messageSingleton = MessageSingleton.getInstance();

export const MessageSing = {
    success: (messages: string, options = {}) => {
        messageSingleton.showMessage({ messages, type: "success", ...options });
    },
    error: (messages: string, options = {}) => {
        messageSingleton.showMessage({ messages, type: "error", ...options });
    },
    warning: (messages: string, options = {}) => {
        messageSingleton.showMessage({ messages, type: "warning", ...options });
    },
    info: (messages: string, options = {}) => {
        messageSingleton.showMessage({ messages, type: "info", ...options });
    },
    destroy: () => {
        messageSingleton.destroy();
    }
};