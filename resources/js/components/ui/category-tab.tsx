type CategoryTabProps = {
  name: string;
  className?: string;
  index?: number;
  onClick?: () => void;
  hasIndicator?: boolean;
  editable?: boolean;
  title?: string;
  setTitle?: (newTitle: string) => void;
};

export default function CategoryTab({
  name,
  className,
  index,
  onClick,
  hasIndicator,
  editable,
  title,
  setTitle,
  ...props
}: CategoryTabProps) {
  return (
    <li
      className={className}
      onClick={() => onClick?.()}
      data-layoutid="4424"
      data-contentid={index}
      {...props}
    >
      {editable ? (
        <div
          contentEditable
          suppressContentEditableWarning
          className="cursor-text title text-1xl p-4 border border-red-400 bg-transparent outline-none whitespace-pre-wrap overflow-hidden text-ellipsis w-full min-h-[1.5em] break-words"
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
          onInput={(e) => {
            const text = e.currentTarget.textContent || '';
            if (text.length <= 70) {
              setTitle?.(text);
            } else {
              // Prevent further input if max length exceeded
              e.currentTarget.textContent = text.slice(0, 70);
              // Move cursor to end
              const range = document.createRange();
              const sel = window.getSelection();
              range.selectNodeContents(e.currentTarget);
              range.collapse(false);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
          }}
          onFocus={(e) => {
            // Select all text on focus
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(e.currentTarget);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }}
          onKeyDown={(e) => {
            // Handle Enter key to prevent new lines if desired
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {title}
        </div>
      ) : (
        <span className="title text-1xl p-4">{name}</span>
      )}
      <span className="sh">
        {hasIndicator && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </span>
    </li>
  );
}