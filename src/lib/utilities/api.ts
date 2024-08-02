export const tagToSlug = (tag: string): string => {
    return tag.toLowerCase().replaceAll(" ", "-").replaceAll(":", "-")
}
