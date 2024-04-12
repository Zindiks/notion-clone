"use client"

import ConfirmModal from "@/components/modals/confirm-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuProp {
  documentId: Id<"documents">
}

const Menu = ({ documentId }: MenuProp) => {
  const archive = useMutation(api.documents.archive)

  const { user } = useUser()

  const router = useRouter()

  const onArchive = () => {
    const promise = archive({ id: documentId })

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note is moved to trash",
      error: "Failed to archive note.",
    })

    router.push("/documents")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <DotsHorizontalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <TrashIcon />
          <span className="ml-2 font-medium text-sm">Delete</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-7 w-10" />
}

export default Menu
