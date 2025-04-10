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
    const labels = [
        ...new Set(apis.flatMap((a) => Object.keys(a.metadata))),
    ] as MetadataLabel[]
    const result = labels.map((label) => ({
        label,
        values: [...new Set(apis.map((a) => a.metadata[label]))],
    }))
    return result
})()
