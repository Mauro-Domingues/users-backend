import type { IObjectDTO } from '@dtos/IObjectDTO';

/**
 * CLONE VALUES -> Receives as parameter a key array and another object of type unknown, returns an array of objects with the same value, is useful for queries find WHERE + OR.
 * @param attribute IObjectDTO[keyof IObjectDTO]
 * @returns Promise: Array<IObjectDTO>
 * @param params Array<string>
 */
export function mapAndCloneAttribute<Entity>(
  attribute: Entity[keyof Entity],
  params: Array<keyof Entity>,
): Array<Partial<IObjectDTO>> {
  const objectArray = params.map(param => {
    return {
      [param]: attribute,
    };
  });
  return objectArray;
}
