import { ExpandableProps } from "../types";

export default function Expandable({ isExpanded, toggleExpand, controlNode }: ExpandableProps) {
    return (<>
        <div className="h-[1px] bg-gray-200 w-full" />
        <div className="min-h-[48px] flex items-center justify-center cursor-pointer" onClick={toggleExpand}>
            {controlNode ? controlNode(isExpanded) :
                isExpanded ? "Collapse" : "Expand"
            }
        </div>
    </>)
}