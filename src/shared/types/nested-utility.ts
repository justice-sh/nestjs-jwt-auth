export type NestedKeys<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${NestedKeys<T[K]>}` : never }[keyof T]
  : never;

export type NestedValue<T, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? Tail extends NestedKeys<T[Head]>
      ? NestedValue<T[Head], Tail>
      : never
    : never
  : K extends keyof T
    ? T[K]
    : never;

// Example usage

// function example() {
//   return {
//     name: 'name',
//     user: {
//       age: 5,
//       size: 3,
//       isTall: false,
//       range: {
//         small: 4,
//         pattern: 'aged',
//       },
//     },
//   };
// }

// function getExampleItem<T extends object, K extends NestedKeys<T>>(
//   obj: T,
//   key: K,
// ): NestedValue<T, K> {
//   return key.split('.').reduce((acc, curr) => acc && acc[curr], obj) as NestedValue<T, K>;
// }

// // ✅ Fully type-safe usage:
// const name = getExampleItem(exampleObject, 'name'); // Inferred as `string`
// const age = getExampleItem(exampleObject, 'user.age'); // Inferred as `number`
// const isTall = getExampleItem(exampleObject, 'user.isTall'); // Inferred as `boolean`
// const range = getExampleItem(exampleObject, 'user.range'); // Inferred as `boolean`

// type Data = typeof exampleObject;

// function getItem<K extends NestedKeys<Data>>(key: K): NestedValue<Data, K> {
//   const obj = exampleObject; // Replace with your actual object
//   return key.split('.').reduce((acc, curr) => acc && acc[curr], obj) as NestedValue<Data, K>;
// }

// // ✅ Fully type-safe usage:
// const name = getItem('name'); // Inferred as `string`
// const age = getItem('user.age'); // Inferred as `number`
// const isTall = getItem('user.isTall'); // Inferred as `boolean`
// const range = getItem('user.range'); // Inferred as `boolean`
// const pattern = getItem('user.range.pattern'); // Inferred as `boolean`
