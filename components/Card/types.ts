import { FeedProfile } from "@/utils/models";

export interface RenderProfileProps {
    item: FeedProfile;
    onLike: (user: FeedProfile, liked: boolean) => void;
}
