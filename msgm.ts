
/**
 * 发布订阅模式
 */
export class Msgm<TypeMap> {

    private __messageListMap: Map<unknown, IMessage<any, TypeMap>[]> = new Map();
    private __messageId: number = 0;

    /**
     * 注册消息
     * @param type 消息类型
     * @param cb 回调函数
     * @param order 优先级 值越大优先级越高
     * @return 唯一标识
     */
    public on<TypeName extends TypeNames<TypeMap>>(type: TypeName, cb: IMessageCb<TypeName, TypeMap>, order?: number): number;
    /**
     * 注册消息
     * @param type 消息类型
     * @param cb 回调函数
     * @param target 回调目标
     * @param order 优先级 值越大优先级越高
     * @return 唯一标识
     */
    public on<TypeName extends TypeNames<TypeMap>>(type: TypeName, cb: IMessageCb<TypeName, TypeMap>, target?: any, order?: number): number;
    public on<TypeName extends TypeNames<TypeMap>>(type: TypeName, cb: IMessageCb<TypeName, TypeMap>, target: any | number = null, order: number = 0): number {
        if (typeof target === "number") {
            order = target;
            target = null;
        }
        let messages = this.__messageListMap.get(type);
        const message: IMessage<TypeName, TypeMap> = {
            cb: cb,
            target: target,
            id: ++this.__messageId,
            order: order,
        };
        if (messages) {
            messages.push(message);
            messages.sort((a, b) => b.order - a.order);
        } else {
            this.__messageListMap.set(type, [message]);
        }
        return message.id;
    }
    /**
     * 注销消息
     * @param type 消息类型
     * @param cb 回调函数
     * @param target 回调目标
     */
    public off<TypeName extends TypeNames<TypeMap>>(type: TypeName, cb: IMessageCb<TypeName, TypeMap>, target: any): void;
    /**
     * 通过唯一标识注销消息
     * @param type 消息类型 
     * @param id 唯一标识
     */
    public off<TypeName extends TypeNames<TypeMap>>(type: TypeName, id: number): void;
    /**
     * 注销指定类型的所有消息
     * @param type 消息类型
     */
    public off<TypeName extends TypeNames<TypeMap>>(type: TypeName): void;
    public off<TypeName extends TypeNames<TypeMap>>(type: TypeName, x: IMessageCb<TypeName, TypeMap> | number | null = null, target: any = null): void {
        const messages = this.__messageListMap.get(type);
        if (!messages) return;

        if (x === null) {
            this.__messageListMap.delete(type);
        } else {
            let index = -1;
            if (typeof x === "number") {
                index = messages.findIndex((message) => message.id === x);
            } else {
                if (target) {
                    index = messages.findIndex((message) => message.cb === x && message.target === target);
                } else {
                    index = messages.findIndex((message) => message.cb === x);
                }
            }
            if (index !== -1) messages.splice(index, 1);
        }
    }

    /**
     * @deprecated 注销指定类型的所有消息 虽然不建议使用 但是依旧可以使用
     * 建议使用off方法
     * @example msg.off(type);
     * @param type 消息类型
     */
    public offAll<TypeName extends TypeNames<TypeMap>>(type: TypeName): void {
        this.off(type);
    }

    /**
     * 发射消息
     * @param type 消息类型
     * @param data 数据
     */
    public emit<TypeName extends TypeNames<TypeMap>>(type: TypeName, data: PayloadType<TypeName, TypeMap> = null!): void {
        const messages = this.__messageListMap.get(type);
        if (!messages) {
            // return console.warn(`你正在尝试发射并不存在的消息, 消息类型: ${type as string}`);
            return;
        }
        messages.forEach((message) => {
            if (message.target) {
                message.cb.call(message.target, data);
            } else {
                message.cb(data);
            }
        });
    }

}

/**
 * 消息回调接口
 */
type IMessageCb<TypeName extends TypeNames<TypeMap>, TypeMap> = (data: PayloadType<TypeName, TypeMap>) => void;
/**
 * 消息对象接口
 */
export interface IMessage<TypeName extends TypeNames<TypeMap>, TypeMap> {
    /**
     * 回调函数
     * @param data 数据
     */
    cb: IMessageCb<TypeName, TypeMap>;
    /**
     * 回调目标
     */
    target: any;
    /**
     * 唯一标识
     */
    id: number;
    /**
     * 执行顺序 值越大优先级越高
     */
    order: number;
}

/**
 * 类型
 */
export type TypeNames<TypeMap> = keyof TypeMap;
/**
 * 参数类型
 */
export type PayloadType<TypeName extends TypeNames<TypeMap>, TypeMap> = TypeMap[TypeName];

/**
 * 类型配置-测试
 * 建议自己新建一个配置文件
 */
export interface TypeMap1 {
    ["event"]: string;
    ["hello"]: string;
}

export enum EType {
    Create = "Create",
    Destroy = "Destroy",
}

export interface TypeMap2 {
    [EType.Create]: { name: string, age: number };
    [EType.Destroy]: { name: string };
}
/**
 * --------------------
 */