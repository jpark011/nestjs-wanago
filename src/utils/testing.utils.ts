/* eslint-disable @typescript-eslint/ban-types */
import { InjectionToken, Provider } from '@nestjs/common';
import { ModuleMocker } from 'jest-mock';

export type OnlyProps<Class> = {
  [key in keyof Class]: Class[key] extends Function ? never : key;
}[keyof Class];

export type OnlyMethods<Class> = {
  [key in keyof Class]: Class[key] extends Function ? key : never;
}[keyof Class];

const moduleMocker = new ModuleMocker(global);

export function provideMock<T = unknown>(
  token: T,
  override?: Pick<T, OnlyMethods<T>>,
): Provider<T> {
  const metadata = moduleMocker.getMetadata(token);
  const MockFactory = moduleMocker.generateFromMetadata(metadata);
  const mocked = new MockFactory();

  if (override) {
    for (const [prop, value] of Object.entries(override)) {
      mocked[prop] = value;
    }
  }

  return {
    provide: token as unknown as InjectionToken,
    useValue: mocked as T,
  };
}
