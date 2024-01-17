import 'reflect-metadata';

export const serializable = (value: boolean) => {
  return Reflect.metadata(PropertyDecoratorMetadata.Serializable, value);
};
export const self = (value: boolean) => {
  return Reflect.metadata(PropertyDecoratorMetadata.Self, value);
};

enum PropertyDecoratorMetadata {
  Serializable = 'serializable',
  Self = 'self',
}

export default PropertyDecoratorMetadata;
