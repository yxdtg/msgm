# msgm
msgm 是一个拥抱类型安全的发布订阅模式库 并且可以控制优先级

## 安装
npm
```bash
npm install msgm
```
yarn
```bash
yarn add msgm
```
pnpm
```bash
pnpm add msgm
```

### 推荐使用TypeScript 因为可以开箱即用以及更方便的配置类型
## 使用
```typescript
// 导入 msgm 库
import { Msgm } from "msgm";
// 创建一个 msgm 实例
const msg = new Msgm();

// 编写一个回调函数
const onEvent = (data) => {
    console.log(`onEvent: ${data}`);
};

// 注册
msg.on("event", onEvent);
// 注销
msg.off("event", onEvent);
// 发射
msg.emit("event", "hello msgm");

// 如果需要，注册消息可以返回消息唯一标识
const id = msg.on("event", onEvent);
// 可以通过唯一标识来注销消息
msg.off("event", id);

// 如果需要，可以设置消息优先级，值越大，优先级越高
msg.on("hello", () => console.log("hello 1"), 1);
msg.on("hello", () => console.log("hello 2"), 2);
msg.on("hello", () => console.log("hello 3"), 3);
msg.emit("hello");
// 这里打印结果为 hello 3 hello 2 hello 1

```
## 类型安全
### 打开目录下的config.d.ts文件
#### 你大概会看到这样一些内容
```typescript
/**
 * 类型配置
 */
export interface TypeMap {
    "event": string;
    "hello": string;
}

// export interface TypeMap {
//     "create": { name: string, age: number };
//     "destroy": { name: string };
// }
```
#### 看到 "event" 和 "hello" 以及后面注释掉的内容了吗
#### 没错，我想你已经猜到了，它们就是保证类型安全的关键。
#### 你可以编写自己的消息类型，使其在注册，注销，发射的过程中保持愉快和安全。