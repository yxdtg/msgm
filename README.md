# msgm
msgm 是一个拥抱类型安全的发布订阅模式库 并且可以控制优先级

## 安装
npm
```bash
npm i msgm
```
yarn
```bash
yarn add msgm
```
pnpm
```bash
pnpm add msgm
```

## 推荐使用TypeScript, 开箱即用 + 方便的类型配置
### 初始化
```typescript
// 导入 msgm类 以及 TypeMap1类型配置项
// 建议自己新建一个配置文件
import { Msgm, TypeMap1} from "msgm";

// 创建一个 msgm 实例 <配置类型接口>
const msg = new Msgm<TypeMap1>();

// 编写一个回调函数
const onEvent = (data) => {
    console.log(`onEvent: ${data}`);
};
```

### 注册
```typescript
// 基础注册
msg.on("event", onEvent);

// 注册消息可以返回消息唯一标识
const id = msg.on("event", onEvent);

// 注册并绑定回调目标, 回调目标是在回调函数中的this指向
msg.on("event", onEvent, this);
// 绑定回调目标并且设置优先级
msg.on("event", onEvent, this, 1);

// 可以设置消息优先级, 值越大, 优先级越高
msg.on("hello", () => console.log("hello 1"), 1);
msg.on("hello", () => console.log("hello 2"), 2);
msg.on("hello", () => console.log("hello 3"), 3);
// 这里发射打印结果为 hello 3 hello 2 hello 1
```

### 注销
```typescript
// 通过回调函数来注销消息
msg.off("event", onEvent);

// 通过唯一标识来注销消息
msg.off("event", id);

// 注销绑定回调目标的消息
msg.off("event", onEvent, this);

// 注销一个消息类型的所有消息
msg.off("event");
```

### 发射
```typescript
// 发射消息
msg.emit("event", "hello msgm");
// 发射无数据消息
msg.emit("event");
```

### 无类型 
```typescript
// 如果要使用无类型的发布订阅 那么也非常简单
const msg = new Msgm<any>();
// ...
```
## 如果不需要类型安全 推荐使用yxmsg库 它同样支持优先级控制

### npm: https://www.npmjs.com/package/yxmsg
### github: https://github.com/yxdtg/yxmsg


## 类型安全
### 打开msgm.ts文件 到达文件底部
#### 你大概会看到这样一些内容
```typescript
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
```
#### 看到 "event" 和 "hello" 以及后面的内容了吗
#### 没错，我想你已经猜到了，它们就是保证类型安全的关键。
#### 你可以编写自己的消息类型，使其在注册，注销，发射的过程中保持愉快和安全。