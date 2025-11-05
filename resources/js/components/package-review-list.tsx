import { PackageReview } from "@/types";
import { Star } from "lucide-react";

interface PackageReviewListProps {
  reviews: {
    data: PackageReview[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  onPageChange?: (page: number) => void;
}

export default function PackageReviewList({ reviews, onPageChange }: PackageReviewListProps) {

  return (
    <div className="flex flex-col gap-4 w-full">
      {reviews.data.map((review) => (
        <div
          key={review.id}
          className="border rounded-lg py-4 px-4 bg-gray-50 shadow-sm w-full"
        >
          <span className="ml-2 font-medium text-gray-800">{review?.user?.first_name}</span>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`mr-1 ${
                  i <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                }`}
              />
            ))}
          </div>
          {review.comment && <p className="text-gray-700 mt-2">{review.comment}</p>}
        </div>
      ))}

      {/* Pagination controls */}
      {reviews.meta && reviews.meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: reviews.meta.last_page }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                page === reviews.meta?.current_page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => onPageChange?.(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
