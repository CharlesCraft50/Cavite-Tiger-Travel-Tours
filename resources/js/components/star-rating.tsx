import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

interface StarRatingProps {
  onChange?: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
}

export default function StarRating({
  onChange,
  initialRating = 0,
  initialComment = "",
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment);

  const handleRating = (value: number) => {
    setRating(value);
    if (onChange) onChange(value, comment);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (onChange) onChange(rating, e.target.value);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Rating Stars */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={clsx(
              "w-8 h-8 cursor-pointer transition-colors duration-150",
              value <= (hover || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            )}
            onClick={() => handleRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>

      {/* Optional Comment */}
      <textarea
        value={comment}
        onChange={handleCommentChange}
        placeholder="Leave a comment (optional)"
        className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-[#fb2056] focus:outline-none"
        rows={3}
      />
    </div>
  );
}
