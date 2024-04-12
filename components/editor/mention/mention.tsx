import { createReactInlineContentSpec } from "@blocknote/react"

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <span className="bg-purple-500 rounded-sm p-[1px]">
        @{props.inlineContent.props.user}
      </span>
    ),
  }
)
