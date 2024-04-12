"use client"

import dynamic from "next/dynamic"

import Cover from "@/components/cover"
import Toolbar from "@/components/toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useParams, usePathname } from "next/navigation"

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">
  }
}

const Editor = dynamic(() => import("@/components/editor/editor"), { ssr: false })

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const pathname = useParams()

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  })

  const update = useMutation(api.documents.update)

  const onChange = (content: string) => {
    update({
      id: params.documentId as Id<"documents">,
      content,
    })
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />

        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10>">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[0%]" />
            <Skeleton className="h-4 w-[50%]" />
            <Skeleton className="h-4 w-[50%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <p>Not Found ...</p>
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lf:md-max-w-4xl mx-auto">
        <Toolbar initialData={document} />

        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  )
}

export default DocumentIdPage
