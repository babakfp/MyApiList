import db from "$lib/db/db.json"

export type API = {
    name: string
    url: string
    description: string
    metadata: Record<string, string>
}

type MetadataLabel = "Category" | "Auth" | "HTTPS" | "CORS"

export const apis: API[] = db

export const apiMetadata = (() => {
    const metadata = apis.map((p) => p.metadata)
    const labels = [
        ...new Set(metadata.flatMap((p) => Object.keys(p))),
    ] as MetadataLabel[]
    const arrayOfProps = labels.map((label) => ({
        label,
        values: [...new Set(metadata.map((p) => p[label]))],
    }))
    return arrayOfProps
})()
