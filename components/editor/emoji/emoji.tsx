import { createReactInlineContentSpec } from "@blocknote/react"

// The Mention inline content.
export const Emoji = createReactInlineContentSpec(
  {
    type: "emoji",
    propSchema: {
      emoji: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <span className="w-6 h-fit">{props.inlineContent.props.emoji}</span>
    ),
  }
)
