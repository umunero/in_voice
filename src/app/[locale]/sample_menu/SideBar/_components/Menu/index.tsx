import React, { useCallback, useEffect, useState } from "react";
import { ChildExpandType, ItemProps, SideBarMenuProps } from "../../types";
import Item from "./Item";

/**
 * Renders a menu for the sidebar.
 * @param
 * @returns 
 */

const Menu = React.memo(function Menu({ items, isExpanded, childExpandType = ChildExpandType.Single }: SideBarMenuProps) {
    const [currentExpandedChild, setCurrentExpandedChild] = useState<string | number | null>(null);

    const setIsExpandChild = useCallback((id: string | number | null) => {
        setCurrentExpandedChild(id);
    }, [])

    // if collapsed, set expanded child to null
    useEffect(() => {
        if (!isExpanded) {
            setCurrentExpandedChild(null)
        }
    }, [isExpanded])

    return (
        <div className="grow shrink flex flex-col items-start px-1">
            {items.map(item => {
                // if is single then have expanded child, else multiple null
                const props: ItemProps = {
                    item,
                    isSidebarExpanded: isExpanded,
                    isItemChildExpanded: childExpandType === ChildExpandType.Single ? currentExpandedChild === item.id : null,
                    setIsExpandChild,
                }
                return <Item
                    key={item.id}
                    {...props}
                />
            })}
        </div>
    )
}
)

export default Menu