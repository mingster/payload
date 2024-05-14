'use client'

import type { TextFieldProps } from '@payloadcms/ui/fields/Text'

import { Select } from '@payloadcms/ui/fields/Select'
import { useForm } from '@payloadcms/ui/forms/Form'
import React, { useEffect, useState } from 'react'

import type { SelectFieldOption } from '../../types.js'

export const DynamicFieldSelector: React.FC<TextFieldProps> = (props) => {
  const { fields, getDataByPath } = useForm()

  const [options, setOptions] = useState<SelectFieldOption[]>([])

  useEffect(() => {
    const fields: any[] = getDataByPath('fields')

    if (fields) {
      const allNonPaymentFields = fields
        .map((block): SelectFieldOption | null => {
          const { name, blockType, label } = block

          if (blockType !== 'payment') {
            return {
              label,
              value: name,
            }
          }

          return null
        })
        .filter(Boolean)
      setOptions(allNonPaymentFields)
    }
  }, [fields, getDataByPath])

  // TODO: label from config is Record<string, string> | false | string
  //  but the FormFieldBase type has only label?: string, changing FormFieldBase breaks other ui components
  return <Select {...props} options={options} />
}
