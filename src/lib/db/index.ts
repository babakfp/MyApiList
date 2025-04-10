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
        ...new Set(apis.flatMap((p) => Object.keys(p.metadata))),
    ] as MetadataLabel[]
    const result = labels.map((label) => ({
        label,
        values: [...new Set(apis.map((p) => p.metadata[label]))],
    }))
    return result
})()
