import { useCallback } from 'react';
import emojiList from '../lib/emojiList';

const useSearchEmoji = (
  startReadEmoji,
  setStartReadEmoji,
  setFilteredEmojis,
  setEmojiIndex,
  setShowEmojiList
) =>
  useCallback(
    (message) => {
      const lastChar = message ? message[message.length - 1] : '';

      if (message.length === 0) {
        setShowEmojiList(false);
        setStartReadEmoji(false);
        setFilteredEmojis([]);
        setEmojiIndex(-1);
        return;
      }

      // Emoji syntax (:emoji:) starts at the beginning of the message or after
      // a space, as in Rocket.Chat, so a time such as 12:00 does not open it.
      const emojiMatch = message.match(/(?:^|\s):([a-zA-Z0-9_+-]*?)$/);

      if (emojiMatch) {
        const query = emojiMatch[1].toLowerCase();

        // Only show suggestions if query is at least 2 characters
        if (query.length >= 2) {
          setStartReadEmoji(true);

          const filteredEmojis = emojiList
            .filter(
              (emoji) =>
                emoji.shortname.toLowerCase().includes(query) ||
                emoji.aliases.some((alias) =>
                  alias.toLowerCase().includes(query)
                )
            )
            .slice(0, 10);

          setFilteredEmojis(filteredEmojis);
          setEmojiIndex(filteredEmojis.length > 0 ? 0 : -1);
          setShowEmojiList(filteredEmojis.length > 0);
        } else {
          setShowEmojiList(false);
          setFilteredEmojis([]);
          setEmojiIndex(-1);
        }
      } else if (startReadEmoji) {
        setStartReadEmoji(false);
        setFilteredEmojis([]);
        setEmojiIndex(-1);
        setShowEmojiList(false);
      }
    },
    [
      startReadEmoji,
      setStartReadEmoji,
      setFilteredEmojis,
      setEmojiIndex,
      setShowEmojiList,
    ]
  );

export default useSearchEmoji;
