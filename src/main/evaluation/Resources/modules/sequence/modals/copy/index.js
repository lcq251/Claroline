/**
 * Sequence copy modal.
 * Allows users to choose if they want to copy the sequence resources too.
 */

import {registry} from '#/main/app/modals/registry'

import {SequenceCopyModal} from '#/main/evaluation/sequence/modals/copy/components/modal'

const MODAL_SEQUENCE_COPY = 'MODAL_SEQUENCE_COPY'

registry.add(MODAL_SEQUENCE_COPY, SequenceCopyModal)

export {
  MODAL_SEQUENCE_COPY
}
