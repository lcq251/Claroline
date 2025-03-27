import React, {createElement} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {toKey} from '#/main/app/utils/text'
import {ContentTitle} from '#/main/app/content/components/title'
import {Sections, Section} from '#/main/app/content/components/sections'

import {DataDetailsSection as DataDetailsSectionTypes} from '#/main/app/content/details/prop-types'
import {createDetailsDefinition} from '#/main/app/content/details/utils'
import {DetailsFieldset} from '#/main/app/content/details/components/fieldset'
import {DescriptionList} from '#/main/app/data/components/description-list'

function getSectionId(section, formId = null) {
  let id = formId ? `${formId}-` : ''

  id += section.id || toKey(section.title)

  return id
}

const DetailsData = props => {
  const hLevel = props.level + (props.title ? 1 : 0)
  let hDisplay
  if (props.displayLevel) {
    hDisplay = props.displayLevel + (props.title ? 1 : 0)
  }

  const sections = createDetailsDefinition(props.definition, props.data)

  const primarySections = 1 === sections.length ? [sections[0]] : sections.filter(section => section.primary)
  const otherSections = 1 !== sections.length ? sections.filter(section => !section.primary) : []
  const openedSection = otherSections.find(section => section.defaultOpened)

  return (
    <div className={classes('data-details', props.className, props.flush && 'data-details-flush', !props.flush && 'content-md')}>
      {props.title &&
        <ContentTitle
          level={props.level}
          displayLevel={props.displayLevel}
          title={props.title}
        />
      }

      {primarySections.map(primarySection =>
        <section key={toKey(primarySection.title)} className={classes('details-primary-section')}>
          <ContentTitle
            level={hLevel}
            displayed={false}
            title={primarySection.title}
          />

          <DescriptionList
            className="mb-0"
            fields={primarySection.fields}
            more={primarySection.more}
            data={props.data}
            size={props.size}
          />
        </section>
      )}

      {0 !== otherSections.length &&
        <Sections
          level={hLevel}
          displayLevel={hDisplay}
          defaultOpened={openedSection ? openedSection.id : undefined}
          flush={props.flush}
        >
          {otherSections.map(section =>
            <Section
              key={toKey(section.title)}
              icon={section.icon}
              title={section.title}
              className={section.className}
              fill={section.fill}
            >
              <DetailsFieldset
                id={getSectionId(section, props.id)}
                fields={section.fields}
                data={props.data}
                help={section.help}
              >
                {section.component && createElement(section.component)}
                {!section.component && section.render && section.render()}
              </DetailsFieldset>
            </Section>
          )}
        </Sections>
      }

      {props.children}
    </div>
  )
}

DetailsData.propTypes = {
  id: T.string,
  className: T.string,
  level: T.number,
  displayLevel: T.number,
  title: T.string,
  data: T.object,
  flush: T.bool,
  definition: T.arrayOf(T.shape(
    DataDetailsSectionTypes.propTypes
  )).isRequired,
  children: T.node
}

DetailsData.defaultProps = {
  level: 2,
  data: {},
  meta: false,
  flush: false
}

export {
  DetailsData
}
