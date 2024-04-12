"use client"
import Image from "next/image"

import { useUser } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"

import { PlusCircledIcon } from "@radix-ui/react-icons"
import { useMutation } from "convex/react"

import { api } from "@/convex/_generated/api"

import { toast } from "sonner"

const DocumentPage = () => {
  const { user } = useUser()
  const create = useMutation(api.documents.create)

  const onCreate = () => {
    const promise = create({ title: "Untitled" })

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created",
      error: "Failed to create new note",
    })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src={"/empty.png"}
        height={300}
        width={300}
        alt="empty"
        className="dark:hidden"
      />

      <Image
        src={"/empty-dark.png"}
        height={300}
        width={300}
        alt="empty"
        className="hidden dark:block"
      />

      <h2 className="text-lg font-medium">
        Welcome{" "}
        <span className="text-pretty text-slate-700">
          {user?.username}`&apos;s{" "}
        </span>{" "}
        Jotion
      </h2>

      <Button onClick={onCreate}>
        <PlusCircledIcon className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentPage
