import Msgm, { EType, TypeMap1, TypeMap2 } from "./msgm";

const msg1 = new Msgm<TypeMap1>();
msg1.on("event", (data) => {
    console.log(data);
});
msg1.emit("event", "hello");

const msg2 = new Msgm<TypeMap2>();
msg2.on(EType.Create, (data) => {
    console.log(data);
});
msg2.emit(EType.Create, { name: "石头", age: 999 });