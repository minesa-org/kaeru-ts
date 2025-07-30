// Define nested interfaces for the emoji structure
interface LabelEmojis {
	bug: string;
	reward: string;
	question: string;
	discussion: string;
	help: string;
}

interface BubbleEmojis {
	done: string;
	stale: string;
	close: string;
	reopen: string;
	archive: string;
	lock: string;
	key: string;
}

interface CircleEmojis {
	done: string;
	stale: string;
	close: string;
	reopen: string;
}

interface KaeruReactionEmojis {
	heart: string;
	thumbsup: string;
	thumbsdown: string;
	haha: string;
	emphasize: string;
	question: string;
}

interface UserReactionEmojis {
	heart: string;
	thumbsup: string;
	thumbsdown: string;
	haha: string;
	emphasize: string;
	question: string;
}

interface TicketEmojis {
	create: string;
	created: string;
	bubble: BubbleEmojis;
	circle: CircleEmojis;
	label: LabelEmojis;
}

interface ReactionEmojis {
	kaeru: KaeruReactionEmojis;
	user: UserReactionEmojis;
}

export interface EmojiConfig {
	ticket: TicketEmojis;
	reactions: ReactionEmojis;
	brain: string;
	sensitive: string;
	bubble: string;
	info: string;
	error: string;
	danger: string;
	redirect: string;
	avatar: string;
	banner: string;
	label: LabelEmojis;
	button: string;
	giftCard: string;
	translate: string;
	timeout: string;
	up: string;
	safety: string;
	doorEnter: string;
	swap: string;
	globe: string;
	dnd: string;
	intelligence: string;
	magic: string;
	text_append: string;
	list_bullet: string;
}
