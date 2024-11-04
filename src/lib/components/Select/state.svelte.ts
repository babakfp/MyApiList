import * as select from "@zag-js/select"
import { normalizeProps, useMachine } from "@zag-js/svelte"

export const useSelect = (context: select.Context) => {
    const [snapshot, send] = useMachine(select.machine(context))
    const api = $derived(select.connect(snapshot, send, normalizeProps))

    return {
        get api() {
            return api
        },
    }
}

export type SelectContext = ReturnType<typeof useSelect>
