import * as radio from "@zag-js/radio-group"
import { normalizeProps, useMachine } from "@zag-js/svelte"

export const useRadioGroup = (context: radio.Context) => {
    const [snapshot, send] = useMachine(radio.machine(context))
    const api = $derived(radio.connect(snapshot, send, normalizeProps))

    return {
        get api() {
            return api
        },
    }
}

export type RadioGroupContext = ReturnType<typeof useRadioGroup>
