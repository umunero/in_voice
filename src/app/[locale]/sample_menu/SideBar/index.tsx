"use client";

import { useState } from "react";
import { ExpandableList, Menu } from "./_components";
import { SideBarProps } from "./types";

export default function SideBar(props: SideBarProps) {
    const { initialExpanded = true } = props;
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    return (<>
        <Menu {...props} isExpanded={isExpanded} />
        <ExpandableList
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
            controlNode={props.controlNode}
        />
    </>)
}
