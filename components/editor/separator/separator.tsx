import {
  createReactBlockSpec,
  createReactInlineContentSpec,
} from "@blocknote/react"

// The Mention inline content.
export const Separator = createReactBlockSpec(
  {
    type: "separator",
    propSchema: {},
    content: "none",
  },
  {
    render: () => (
      <div className="border-b w-full border-slate-800 dark:border-slate-200"></div>
    ),
  }
)
