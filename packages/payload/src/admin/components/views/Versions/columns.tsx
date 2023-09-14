import type { TFunction } from 'react-i18next'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import type { SanitizedCollectionConfig } from '../../../../collections/config/types'
import type { SanitizedGlobalConfig } from '../../../../globals/config/types'
import type { Column } from '../../elements/Table/types'

import { Pill } from '../..'
import { formatDate } from '../../../utilities/formatDate'
import SortColumn from '../../elements/SortColumn'
import { useConfig } from '../../utilities/Config'

type CreatedAtCellProps = {
  collection?: SanitizedCollectionConfig
  date: string
  global?: SanitizedGlobalConfig
  id: string
}

const CreatedAtCell: React.FC<CreatedAtCellProps> = ({ collection, date, global, id }) => {
  const {
    admin: { dateFormat },
    routes: { admin },
  } = useConfig()
  const {
    params: { id: docID },
  } = useRouteMatch<{ id: string }>()

  const { i18n } = useTranslation()

  let to: string

  if (collection) to = `${admin}/collections/${collection.slug}/${docID}/versions/${id}`
  if (global) to = `${admin}/globals/${global.slug}/versions/${id}`

  return <Link to={to}>{date && formatDate(date, dateFormat, i18n?.language)}</Link>
}

const TextCell: React.FC<{ children?: React.ReactNode }> = ({ children }) => <span>{children}</span>

export const buildVersionColumns = (
  collection: SanitizedCollectionConfig,
  global: SanitizedGlobalConfig,
  t: TFunction,
): Column[] => [
  {
    accessor: 'updatedAt',
    active: true,
    components: {
      Heading: <SortColumn label={t('general:updatedAt')} name="updatedAt" />,
      renderCell: (row, data) => (
        <CreatedAtCell collection={collection} date={data} global={global} id={row?.id} />
      ),
    },
    label: '',
    name: '',
  },
  {
    accessor: 'id',
    active: true,
    components: {
      Heading: <SortColumn disable label={t('versionID')} name="id" />,
      renderCell: (row, data) => <TextCell>{data}</TextCell>,
    },
    label: '',
    name: '',
  },
  {
    accessor: 'autosave',
    active: true,
    components: {
      Heading: <SortColumn disable label={t('type')} name="autosave" />,
      renderCell: (row) => (
        <TextCell>
          {row?.autosave && (
            <React.Fragment>
              <Pill>{t('autosave')}</Pill>
              &nbsp;&nbsp;
            </React.Fragment>
          )}
          {row?.version._status === 'published' && (
            <React.Fragment>
              <Pill pillStyle="success">{t('published')}</Pill>
              &nbsp;&nbsp;
            </React.Fragment>
          )}
          {row?.version._status === 'draft' && <Pill>{t('draft')}</Pill>}
        </TextCell>
      ),
    },
    label: '',
    name: '',
  },
]
