"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"
import { Cross1Icon, ImageIcon } from "@radix-ui/react-icons"

import { useCoverImage } from "@/hooks/use-cover-image"
import { removeCoverImage } from "@/convex/documents"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useEdgeStore } from "@/lib/edgestore"
import { Skeleton } from "./ui/skeleton"

interface CoverImageProps {
  url?: string
  preview?: boolean
}

const Cover = ({ url, preview }: CoverImageProps) => {
  const coverImage = useCoverImage()
  const params = useParams()

  const { edgestore } = useEdgeStore()

  const removeCoverImage = useMutation(api.documents.removeCoverImage)

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ url: url })
    }

    removeCoverImage({
      id: params.documentId as Id<"documents">,
    })
  }

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill alt={"cover"} className="object-cover" />}

      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            variant={"secondary"}
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            <span>Change Cover</span>
          </Button>

          <Button
            variant={"secondary"}
            onClick={onRemove}
            className="text-muted-foreground text-xs"
          >
            <Cross1Icon className="h-4 w-4 mr-2" />
            <span>Remove</span>
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[35vh]" />
}
export default Cover
