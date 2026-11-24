import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactSectionBlock } from '@/blocks/ContactSection/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CoursesShowcaseBlock } from '@/blocks/CoursesShowcase/Component'
import { FacultyGridBlock } from '@/blocks/FacultyGrid/Component'
import { FeatureCardsBlock } from '@/blocks/FeatureCards/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GalleryBlockComponent } from '@/blocks/GalleryBlock/Component'
import { ImageGridBlock } from '@/blocks/ImageGrid/Component'
import { ListColumnsBlock } from '@/blocks/ListColumns/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { RecruitersBlockComponent } from '@/blocks/RecruitersBlock/Component'
import { SplitContentBlock } from '@/blocks/SplitContent/Component'
import { StatsBlockComponent } from '@/blocks/Stats/Component'

/** Blocks that render their own full-width <section> with padding. */
const sectionBlocks = {
  contactSection: ContactSectionBlock,
  coursesShowcase: CoursesShowcaseBlock,
  cta: CallToActionBlock,
  facultyGrid: FacultyGridBlock,
  featureCards: FeatureCardsBlock,
  formBlock: FormBlock,
  gallery: GalleryBlockComponent,
  imageGrid: ImageGridBlock,
  listColumns: ListColumnsBlock,
  recruiters: RecruitersBlockComponent,
  splitContent: SplitContentBlock,
  stats: StatsBlockComponent,
}

/** Template blocks that expect outer spacing. */
const inlineBlocks = {
  archive: ArchiveBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType in sectionBlocks) {
          const Block = sectionBlocks[blockType as keyof typeof sectionBlocks]
          // @ts-expect-error each block receives its own props shape
          return <Block key={block.id || index} {...block} />
        }

        if (blockType in inlineBlocks) {
          const Block = inlineBlocks[blockType as keyof typeof inlineBlocks]
          return (
            <div className="my-16" key={block.id || index}>
              {/* @ts-expect-error there may be some mismatch between the expected types here */}
              <Block {...block} disableInnerContainer />
            </div>
          )
        }

        return null
      })}
    </Fragment>
  )
}
