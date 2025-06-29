import { classMerge } from "@/lib/utils/tools";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import React from "react";
import { ItemProps } from "../../types";

const Item = React.memo(function Item({ item, isSidebarExpanded, isItemChildExpanded, setIsExpandChild, updateParentHeight }: ItemProps) {
    const [isExpand, setIsExpand] = useState(!!isItemChildExpanded);
    const [childExpanded, setChildExpanded] = useState<string | number | null>(null);
    const [height, setHeight] = useState(0);
    const heightRef = useRef(0);
    const haveChildren = item.children && item.children.length > 0;
    const contentRef = useRef<HTMLDivElement>(null)

    // Item onClick event
    const onClick = () => {
        if (haveChildren && isSidebarExpanded) {
            const state = !isExpand;
            setIsExpandChild(state ? item.id : null)
            updateHeight(state)
            setIsExpand(state)
        }
    }

    // update Item height
    const updateHeight = useCallback((state: boolean) => {
        let height = 0
        if (contentRef.current) {
            height = contentRef.current.scrollHeight
        }
        heightRef.current = height
        if (!state) {
            setHeight(0)
        } else {
            setHeight(height)
        }
    }, [])

    // update Item parent height
    const setParentHeight = useCallback((newHeight: number) => {
        setHeight(prev => {
            const height = prev + newHeight
            return height
        })
    }, [])

    // render children component
    const children = useMemo(() => {
        return item.children?.map(child => {
            const props: ItemProps = {
                item: child,
                isSidebarExpanded,
                isItemChildExpanded: isItemChildExpanded === null ? null : childExpanded === child.id,
                setIsExpandChild: setChildExpanded,
                updateParentHeight: setParentHeight,
            }
            return <Item key={child.id} {...props} />;
        })
    }, [item.children, isItemChildExpanded, childExpanded, isSidebarExpanded, setParentHeight])

    // update when isItemChildExpanded changed, then update height
    // e.g. current Item need to be collapse => isItemChildExpanded (null/false) => updateHeight(null)
    useEffect(() => {
        const state = !!isItemChildExpanded;
        const isNull = isItemChildExpanded === null;
        if (isExpand !== state) {
            if (!isNull) {
                setIsExpand(state)
            }
            updateHeight(!isNull ? state : isExpand)
            setChildExpanded(null)
        }
        if (!isExpand) {
            setChildExpanded(null)
        }
    }, [isItemChildExpanded, updateHeight, isExpand, item.id, setChildExpanded])

    // when height changed, update parent height if function available
    // because parent height also have setting max height
    useEffect(() => {
        if (height == 0 || height < heightRef.current) {
            const deductHeight = height > 0 ? height : heightRef.current
            updateParentHeight?.(-deductHeight)
            heightRef.current = 0
        } else {
            updateParentHeight?.(heightRef.current)
        }

        if (height > heightRef.current) {
            heightRef.current = height
        }
    }, [height, item.id, updateParentHeight, heightRef])

    return (
        <div className="flex flex-col self-stretch pt-2">
            <div
                className={classMerge("flex items-center min-h-[2.5rem] border cursor-pointer transition-transform duration-500 ease-in-out hover:bg-gray-100 rounded-md px-3", {
                    "justify-center": !isSidebarExpanded,
                    "justify-start": isSidebarExpanded,
                })}
                onClick={onClick}
            >
                <span className={classMerge("transition-all duration-300 ease-linear", {
                    "text-xl min-w-5": isSidebarExpanded,
                    "text-2xl min-w-6": !isSidebarExpanded,
                })}>
                    {item.icon}
                </span>
                <span
                    className={classMerge(`whitespace-nowrap overflow-hidden transition-all duration-300 ease-linear text-sm flex items-center gap-2`, {
                        "w-full opacity-100 ml-2": isSidebarExpanded,
                        "w-0 opacity-0": !isSidebarExpanded
                    })}
                >
                    {item.label}
                    {haveChildren && (
                        <span className="ml-auto">
                            {isExpand ? "▲" : "▼"}
                        </span>
                    )}
                </span>
            </div>
            {haveChildren && <div
                ref={contentRef}
                className={"flex flex-col pl-2 transition-all duration-150 ease-linear overflow-hidden"}
                style={{ maxHeight: height }}
            >
                {children}
            </div>}
        </div>
    )
})

export default Item;