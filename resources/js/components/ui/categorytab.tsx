
type CategoryTabProps = {
    name: string,
    className?: string
    index?: number,
    onClick?: () => void;
    hasIndicator?: boolean
}

export default function CategoryTab({ name, className, index, onClick, hasIndicator, ...props }: CategoryTabProps ) {

    return (
        <li
            className={className}
            onClick={() => onClick?.()}
            data-layoutid="4424"
            data-contentid={index}
            {...props}
        >
            <span className="title text-1xl p-4">{name}</span>
            <span className="sh">
            {hasIndicator && (<svg
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
            </svg>)}
            </span>
        </li>
    );

}