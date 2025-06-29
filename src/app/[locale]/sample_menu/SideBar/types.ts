import { ReactNode } from "react";

export enum ChildExpandType {
    Single = "single",
    Multiple = "multiple",
}

export interface SideBarProps {
    items: ListItem[];
    initialExpanded?: boolean;
    childExpandType?: ChildExpandType;
    controlNode?: (isExpanded: boolean) => ReactNode;
}

export interface ExpandableProps {
    isExpanded: boolean;
    toggleExpand: () => void;
    controlNode?: (isExpanded: boolean) => ReactNode;
}

export interface ListItem {
    id: string | number;
    key: string | number;
    icon?: React.ReactNode;
    label: string;
    children?: ListItem[];
}

export interface SideBarMenuProps {
    items: ListItem[];
    isExpanded: boolean;
    childExpandType?: ChildExpandType;
}

export interface ItemProps {
    item: ListItem;
    isSidebarExpanded: boolean;
    isItemChildExpanded: boolean | null;
    setIsExpandChild: (id: string | number | null) => void;
    updateParentHeight?: (height: number) => void;
}
