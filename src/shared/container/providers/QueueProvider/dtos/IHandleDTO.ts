export interface IHandleDTO {
  new (...args: Array<unknown>): {
    handle({ data }: { data: unknown }): unknown;
  };
  readonly key: Capitalize<string>;
}
