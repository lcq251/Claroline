import React from 'react'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ResourceEditor} from '#/main/core/resource'

import {selectors} from '#/main/evaluation/sequence/store'
import {EditorScenario} from '#/main/evaluation/sequence/editor/components/scenario'
import {PathEditorAppearance} from '#/main/evaluation/sequence/editor/components/appearance'

 const PathEditor = () => {
   const path = useSelector(selectors.path)

   return (
     <ResourceEditor
       styles={['claroline-distribution-plugin-path-path-resource']}
       //defaultPage="steps"
       additionalData={() => ({
         resource: path
       })}
       appearancePage={PathEditorAppearance}
       pages={[
         {
           name: 'steps',
           title: trans('Scenario'),
           component: EditorScenario
         }
       ]}
     />
   )
 }

export {
  PathEditor
}
