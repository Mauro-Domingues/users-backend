import type { IObjectDTO } from '@dtos/IObjectDTO';

/**
 * PUT OBJECT -> Takes as a parameter an entity and an object, maps the object and returns the entity with the updated properties. Considers empty values sent, but non-entity-type properties are discarded.
 * @param oldAttributes Entity
 * @param newAttributes Object
 * @returns Entity
 */
export function mapAndUpdateAttribute<
  Entity extends object,
  DTO extends Partial<Entity>,
>(oldAttributes: Entity, newAttributes: DTO): Entity {
  Object.keys(newAttributes).forEach(attribute => {
    if (Object.hasOwn(oldAttributes, attribute)) {
      let newValue = (newAttributes as IObjectDTO)[attribute];
      if (Array.isArray(newValue)) {
        newValue = newValue.map((item, index) => {
          let oldItem = (oldAttributes as Record<string, Array<IObjectDTO>>)[
            attribute
          ][index];
          if (Object.hasOwn(item, 'id')) {
            const exists = (oldAttributes as Record<string, Array<IObjectDTO>>)[
              attribute
            ].find(oldItem => oldItem.id === item.id);
            if (exists) oldItem = exists;
          }
          if (
            oldItem &&
            typeof item === 'object' &&
            item !== null &&
            !Array.isArray(item)
          ) {
            return mapAndUpdateAttribute(oldItem, item as IObjectDTO);
          }
          return item;
        });
        Object.assign(oldAttributes, { [attribute]: newValue });
      } else if (
        typeof newValue === 'object' &&
        !(newValue instanceof Date) &&
        newValue !== null
      ) {
        (oldAttributes as IObjectDTO)[attribute] = mapAndUpdateAttribute(
          (oldAttributes as IObjectDTO)[attribute] as IObjectDTO,
          newValue as IObjectDTO,
        );
      } else {
        Object.assign(oldAttributes, { [attribute]: newValue });
      }
    }
  });
  return oldAttributes;
}
