import db from "$lib/db/db.json"

export type API = {
    name: string
    url: string
    description: string
    props: Record<string, string>
}

export const apis: API[] = db

export const apiProps = (() => {
    const props = apis.map((p) => p.props)
    const labels = [...new Set(props.flatMap((p) => Object.keys(p)))] as (
        | "Category"
        | "Auth"
        | "HTTPS"
        | "CORS"
    )[]
    const arrayOfProps = labels.map((label) => ({
        label,
        values: [...new Set(props.map((p) => p[label]))],
    }))
    return arrayOfProps
})()
