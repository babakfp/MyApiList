import publicApis from "$lib/db/public-apis.json"

export type Api = {
    name: string
    url: string
    description: string
    properties: Record<string, string>
}

export const apis: Api[] = publicApis
