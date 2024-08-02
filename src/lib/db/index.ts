export type Api = {
    name: string
    url: string
    description: string
    tags: ("REST API" | "Auth:No" | "Auth:Key" | "Auth:OAuth" | "Movies")[]
}

export const apis: Api[] = [
    {
        name: "The Movie Database (TMDb)",
        url: "https://developer.themoviedb.org",
        description:
            "The Movie Database (TMDb) is a popular movie database and information service. It is a community-driven project, and is owned by the volunteers behind it.",
        tags: ["REST API", "Auth:No", "Auth:Key", "Movies"],
    },
]
