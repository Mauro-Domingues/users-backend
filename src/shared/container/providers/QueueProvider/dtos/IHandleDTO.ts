export interface IHandleDTO {
  new (...args: Array<never>): {
    handle({ data }: { data: unknown }): unknown;
  };
  readonly key: Capitalize<string>;
}
