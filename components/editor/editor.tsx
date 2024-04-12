"use client"

import {
  BlockNoteEditor,
  BlockNoteSchema,
  PartialBlock,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core"

import {
  BlockNoteView,
  BlockTypeSelect,
  FormattingToolbarController,
  ImageCaptionButton,
  ReplaceImageButton,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
  BasicTextStyleButton,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  DefaultReactSuggestionItem,
} from "@blocknote/react"

import "@blocknote/react/style.css"
import { useTheme } from "next-themes"
import { Alert } from "./alert/alert"
import { CheckCircledIcon, FaceIcon } from "@radix-ui/react-icons"
import { BlueButton } from "./BlueButton"
import emojis from "./emoji/emojis"

import { Mention } from "./mention/mention"
import { Separator } from "./separator/separator"
import EmojiPicker from "emoji-picker-react"
import { Emoji } from "./emoji/emoji"

interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    alert: Alert,
    separator: Separator,
  },

  inlineContentSpecs: {
    // Adds all default inline content.
    ...defaultInlineContentSpecs,
    // Adds the mention tag.
    mention: Mention,
    emoji: Emoji,
  },
})

const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Alert",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "alert",
    })
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Custom",
  icon: <CheckCircledIcon />,
})

const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => {
  const users = ["Steve", "Bob", "Joe", "Mike"]

  return users.map((user) => ({
    title: user,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            user,
          },
        },
        " ", // add a space after the mention
      ])
    },
  }))
}

//  editor.insertInlineContent([
//    {
//      type: "emoji",
//      props: {
//        emoji: data.emoji,
//      },
//    },
//    " ", // add a space after the mention
//  ])

const getEmojiMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => {
  console.log(emojis.smileys_people)

  return emojis.smileys_people.map((emoji: any) => ({
    title: String.fromCodePoint(parseInt(emoji.u, 16)),
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "emoji",
          props: {
            emoji: String.fromCodePoint(parseInt(emoji.u, 16)),
          },
        },
        " ", // add a space after the mention
      ])
    },
  }))
}

const insertSeparator = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Separator",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "separator",
    })
  },
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Custom",
  icon: <CheckCircledIcon />,
})

const handleEmojiClick = (
  editor: typeof schema.BlockNoteEditor,
  emoji: string
) => {
  editor.insertInlineContent([
    {
      type: "emoji",
      props: {
        emoji,
      },
    },
    " ", // add a space after the emoji
  ])
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme()

  const editor: BlockNoteEditor = useCreateBlockNote({
    schema,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  })

  return (
    <div>
      <BlockNoteView
        editable
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => onChange(JSON.stringify(editor.document))}
        slashMenu={false}
        formattingToolbar={false}
      >
        <>
          <FormattingToolbarController
            formattingToolbar={() => (
              <FormattingToolbar>
                <BlockTypeSelect key={"blockTypeSelect"} />

                {/* Extra button to toggle blue text & background */}
                <BlueButton key={"customButton"} />

                <ImageCaptionButton key={"imageCaptionButton"} />
                <ReplaceImageButton key={"replaceImageButton"} />

                <BasicTextStyleButton
                  basicTextStyle={"bold"}
                  key={"boldStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"italic"}
                  key={"italicStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"underline"}
                  key={"underlineStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"strike"}
                  key={"strikeStyleButton"}
                />
                {/* Extra button to toggle code styles */}
                <BasicTextStyleButton
                  key={"codeStyleButton"}
                  basicTextStyle={"code"}
                />

                <TextAlignButton
                  textAlignment={"left"}
                  key={"textAlignLeftButton"}
                />
                <TextAlignButton
                  textAlignment={"center"}
                  key={"textAlignCenterButton"}
                />
                <TextAlignButton
                  textAlignment={"right"}
                  key={"textAlignRightButton"}
                />

                <ColorStyleButton key={"colorStyleButton"} />

                <NestBlockButton key={"nestBlockButton"} />
                <UnnestBlockButton key={"unnestBlockButton"} />

                <CreateLinkButton key={"createLinkButton"} />
              </FormattingToolbar>
            )}
          />

          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(
                [
                  ...getDefaultReactSlashMenuItems(editor),
                  insertAlert(editor),
                  insertSeparator(editor),
                ],
                query
              )
            }
          />

          <SuggestionMenuController
            triggerCharacter={"@"}
            getItems={async (query) =>
              // Gets the mentions menu items
              filterSuggestionItems(getMentionMenuItems(editor), query)
            }
          />

          <SuggestionMenuController
            triggerCharacter={":"}
            getItems={async (query) =>
              // Gets the mentions menu items
              filterSuggestionItems(getEmojiMenuItems(editor), query)
            }
          />

          {/* <EmojiPicker
            onEmojiClick={(data) => handleEmojiClick(editor, data.emoji)}
          /> */}
        </>
      </BlockNoteView>
    </div>
  )
}

export default Editor
