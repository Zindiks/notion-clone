"use client"

import { Doc } from "@/convex/_generated/dataModel"
import IconPicker from "./icon-picker"
import { Button } from "./ui/button"
import { Cross1Icon, FaceIcon, ImageIcon } from "@radix-ui/react-icons"
import { ElementRef, useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

import TextareaAutosize from "react-textarea-autosize"
import { useCoverImage } from "@/hooks/use-cover-image"



interface ToolbarProps {
  initialData: Doc<"documents">
  preview?: boolean
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null)

  const [isEditing, setIsEditing] = useState(false)


  const coverImage = useCoverImage()

  const [value, setValue] = useState(initialData.title)

  const update = useMutation(api.documents.update)

  const removeIcon = useMutation(api.documents.removeIcon)

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)

      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => {
    setIsEditing(false)
  }

  const onInput = (value: string) => {
    setValue(value)
    update({
      id: initialData._id,
      title: value || "untitled",
    })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "enter") {
      event.preventDefault()
      disableInput()
    }
  }

  const onIconSelect = async (icon: string) => {
    await update({
      id: initialData._id,
      icon,
    })
  }

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    })
  }

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>

          <Button
            onClick={onRemoveIcon}
            variant={"outline"}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            size={"icon"}
          >
            <Cross1Icon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant={"outline"}
              size={"sm"}
            >
              <FaceIcon className="w-4 h-4 mr-2" />
              add icon
            </Button>
          </IconPicker>
        )}

        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs "
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            add cover
          </Button>
        )}
      </div>

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none resize-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl break-words font-bold outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}

export default Toolbar
