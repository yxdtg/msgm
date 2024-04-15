import { TypeMap } from "./config";

/**
 * 发布订阅模式
 */
export default class Msgm {

    private __messageListMap: Map<unknown, IMessage<any>[]> = new Map();
    private __messageId: number = 0;

    /**
     * 注册消息
     * @param type 类型
     * @param cb 回调函数
     * @param order 执行顺序 值越大优先级越高
     * @param id 唯一标识
     */
    public on<TypeName extends TypeNames>(type: TypeName, cb: IMessageCb<TypeName>, order: number = 0): number {
        let messages = this.__messageListMap.get(type);
        const message: IMessage<TypeName> = {
            cb: cb,
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
     * @param type 类型
     * @param cb 回调函数
     */
    public off<TypeName extends TypeNames>(type: TypeName, cb: IMessageCb<TypeName>): void;
    /**
     * 通过唯一标识注销消息
     * @param type 类型 
     * @param id 唯一标识
     */
    public off<TypeName extends TypeNames>(type: TypeName, id: number): void;
    public off<TypeName extends TypeNames>(type: TypeName, x: IMessageCb<TypeName> | number): void {
        const messages = this.__messageListMap.get(type);
        if (!messages) return;
        let index = -1;
        if (typeof x === "number") {
            index = messages.findIndex((message) => message.id === x);
        } else {
            index = messages.findIndex((message) => message.cb === x);
        }
        if (index !== -1) messages.splice(index, 1);
    }

    /**
     * 发射消息
     * @param type 类型
     * @param data 数据
     */
    public emit<TypeName extends TypeNames>(type: TypeName, data: PayloadType<TypeName> = null!): void {
        const messages = this.__messageListMap.get(type);
        if (!messages) return;
        messages.forEach((message) => {
            message.cb(data);
        });
    }

}

/**
 * 消息回调接口
 */
type IMessageCb<TypeName extends TypeNames> = (data: PayloadType<TypeName>) => void;
/**
 * 消息对象接口
 */
export interface IMessage<TypeName extends TypeNames> {
    /**
     * 回调函数
     * @param data 数据
     */
    cb: IMessageCb<TypeName>;
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
export type TypeNames = keyof TypeMap;
/**
 * 参数类型
 */
export type PayloadType<TypeName extends TypeNames> = TypeMap[TypeName];