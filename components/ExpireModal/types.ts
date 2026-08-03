export type ChatEndKind = "expired" | "you-ended" | "partner-ended" | "partner-left";

export interface ExpireModalProps {
    showModal: boolean;
    kind: ChatEndKind;
}
