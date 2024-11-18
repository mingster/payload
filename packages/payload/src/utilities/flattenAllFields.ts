import type { Field, FlattenField } from '../fields/config/types.js'

import { tabHasName } from '../fields/config/types.js'

export const flattenAllFields = ({ fields }: { fields: Field[] }): FlattenField[] => {
  const result: FlattenField[] = []

  for (const field of fields) {
    switch (field.type) {
      case 'array':
      case 'group': {
        result.push({ ...field, flattenFields: flattenAllFields({ fields: field.fields }) })
        break
      }

      case 'blocks': {
        const blocks = []
        for (const block of field.blocks) {
          blocks.push({
            ...block,
            flattenFields: flattenAllFields({ fields: block.fields }),
          })
        }
        result.push({
          ...field,
          blocks,
        })
        break
      }

      case 'collapsible':
      case 'row': {
        for (const nestedField of flattenAllFields({ fields: field.fields })) {
          result.push(nestedField)
        }
        break
      }

      case 'tabs': {
        for (const tab of field.tabs) {
          if (!tabHasName(tab)) {
            for (const nestedField of flattenAllFields({ fields: tab.fields })) {
              result.push(nestedField)
            }
          } else {
            result.push({
              ...tab,
              type: 'tab',
              flattenFields: flattenAllFields({ fields: tab.fields }),
            })
          }
        }
        break
      }

      default: {
        if (field.type !== 'ui') {
          result.push(field)
        }
      }
    }
  }

  return result
}
