import {connect} from 'react-redux'

import {selectors as contentSelectors} from '#/main/core/widget/content/store'
import {MarkdownWidget as MarkdownWidgetComponent} from '#/integration/mindme-markdown/widgets/markdown/components/main'

const MarkdownWidget = connect(
  (state) => ({
    content: contentSelectors.parameters(state).content
  })
)(MarkdownWidgetComponent)

export {
  MarkdownWidget
}