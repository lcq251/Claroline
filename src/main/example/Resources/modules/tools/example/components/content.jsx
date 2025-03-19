import React from 'react'
import classes from 'classnames'

import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {ContentTitle} from '#/main/app/content/components/title'
import {PageHeading, PageSection} from '#/main/app/page'
import {PageHeadingSkeleton} from '#/main/app/page/components/heading'

const ExampleContent = () =>
  <PageSection size="lg" className="pb-5">
    <ContentTitle title="Titles" />

    <ContentTitle title="Title 1" level={1} numbering={1} />
    <ContentTitle title="Title 2" level={2} numbering={2} />
    <ContentTitle title="Title 3" level={3} numbering={3} />
    <ContentTitle title="Title 4" level={4} numbering={4} />
    <ContentTitle title="Title 5" level={5} numbering={5} />
    <ContentTitle title="Title 6" level={6} numbering={6} />

    <hr className="my-5" />
    <ContentTitle title="Content sizing" />

    {['lg', 'md', 'sm'].map(size =>
      <div
        key={size}
        className={classes('my-3 bg-secondary-subtle text-secondary-emphasis d-flex justify-content-center align-items-center', `content-${size}`)}
        style={{height: 120}}
      >
        .content-{size}
      </div>
    )}

    <hr className="my-5" />
    <ContentTitle title="Empty states" />

    <ContentPlaceholder
      className="mb-3"
      icon="fa fa-fw fa-bomb"
      title="No content found."
      help="This is an additional help text to guide the user to fill the data which will replace the placeholder"
      size="lg"
    />

    <ContentPlaceholder
      className="mb-3"
      title="No content found."
      size="lg"
    />

    <ContentPlaceholder
      className="mb-3"
      title="No content found."
      size="md"
    />

    <ContentPlaceholder
      className="mb-3"
      title="No content found."
      size="sm"
    />

    <hr className="my-5" />
    <PageHeading
      eyebrow="Eyebrow"
      title="Page heading title"
      description="Nulla aliquam condimentum ipsum sit amet bibendum. Nulla nec gravida augue. Integer quis felis vel massa interdum tristique sed at tellus. Sed congue fringilla orci at rutrum. Curabitur id nibh pulvinar massa volutpat auctor a sit amet dui."
    />

    <PageHeadingSkeleton
      eyebrow={true}
      description={true}
    />
  </PageSection>

export {
  ExampleContent
}
