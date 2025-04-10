import { unique } from "remeda"
import db from "$lib/db/db.json"

export type API = {
    name: string
    url: string
    description: string
    props: Record<string, string>
}

export const apis: API[] = db

const apisProps = apis.map((a) => a.props)
const apisPropsKeys = unique(apisProps.flatMap((a) => Object.keys(a)))
export const apisPropsKeysValues = apisPropsKeys.map((p) => ({
    label: p as "Category" | "Auth" | "HTTPS" | "CORS",
    values: unique(apisProps.map((a) => a[p])),
}))
