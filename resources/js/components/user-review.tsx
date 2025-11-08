import { Star } from "lucide-react";

interface UserReviewProps {
  userName: string;
  rating: number;
  comment?: string | null;
  isCompleted?: boolean;
}

export default function UserReview({ userName, rating, comment, isCompleted }: UserReviewProps) {
  if (!isCompleted) {
    return (
      <p className="text-gray-500 text-center italic dark:text-white">
        You can leave a review once this trip is completed.
      </p>
    );
  }

  if (!rating && !comment) {
    return (
      <p className="text-gray-500 text-center italic dark:text-white">
        You haven’t left a review yet. Share your thoughts about this trip!
      </p>
    );
  }

  return (
    <div className="border rounded-lg py-4 px-4 bg-gray-50 dark:bg-accent shadow-sm max-w-full w-full">
      <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{userName}</span>
      <div className="flex items-center mt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`mr-1 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
          />
        ))}
      </div>
      {comment && <p className="text-gray-700 dark:text-gray-200 mt-2">{comment}</p>}
    </div>
  );
}
