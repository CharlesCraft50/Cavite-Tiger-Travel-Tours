import { AlertCircle, Info } from "lucide-react";

type NoteMessageProps = {
  type: 'important' | 'note';
  message: string;
  leading?: string;
};

export default function NoteMessage({ type, message, leading }: NoteMessageProps) {
  const colors = type === 'important'
    ? 'border-red-300 bg-red-50 text-red-800'
    : 'border-blue-200 bg-blue-50 text-blue-800';

  const Icon = type === 'important' ? AlertCircle : Info;

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${colors}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0" />
      <div className="flex-1 text-sm leading-relaxed">
        <span className="font-medium">
          {leading ? leading : type === 'important' ? 'Important!' : 'Note:'}
        </span>{" "}
        {message}
      </div>
    </div>
  );
}
