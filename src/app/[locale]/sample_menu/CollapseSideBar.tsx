import { ItemProps, SideBarProps } from "./SideBar/types";
import Popover from "./Popover";

export default function CollapseSideBar({ items }: SideBarProps) {
    return (
        <div className="flex flex-col">
            {items.map(item => {
                return (
                    <Item key={item.id} item={item}
                        isSidebarExpanded={false}
                        isItemChildExpanded={null}
                        setIsExpandChild={function (id: string | number | null): void {
                            console.log(id)
                            throw new Error("Function not implemented.");
                        }} />
                )
            })}
        </div>
    );
}

function Item({ item }: ItemProps) {

    return (

        <Popover
            triggerEvent="hover"
            placement="right-start" // Example placement
            content={
                <div className="p-4 text-sm">
                    <h3 className="font-semibold mb-2 text-gray-900">TypeScript Popover!</h3>
                    <p className="text-gray-700">
                        This is a fully custom popover built with React, TypeScript, and Tailwind CSS.
                    </p>
                    <button className="mt-4 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors">
                        Learn More
                    </button>
                </div>
            }
        >
            <div className="relative border px-2 py-1 rounded-lg mx-2 my-1 hover:bg-gray-200 cursor-pointer text-2xl">
                {item.icon}
            </div>
        </Popover>
    )
}