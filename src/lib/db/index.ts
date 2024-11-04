import { unique } from "remeda"
import publicApis from "$lib/db/public-apis.json"

export type Api = {
    name: string
    url: string
    description: string
    props: Record<string, string>
}

export const apis: Api[] = publicApis.filter((a) => !a.hidden)

export const apisProps = apis.map((a) => a.props)
export const apisPropsKeys = unique(apisProps.flatMap((a) => Object.keys(a)))
export const apisPropsKeysValues = apisPropsKeys.map((p) => ({
    label: p as "Category" | "Auth" | "HTTPS" | "CORS",
    values: unique(apisProps.map((a) => a[p])),
}))
