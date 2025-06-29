'use client'

import { IconGoogleIcon } from "@/components/icon";
import RequestQuote from '@material-symbols/svg-200/outlined/request_quote.svg';
import SendMoney from '@material-symbols/svg-200/outlined/send_money.svg';
import BarChart from '@material-symbols/svg-200/outlined/bar_chart.svg';
import { ListItem } from "./SideBar/types";
import CollapseSideBar from "./CollapseSideBar";

export default function Page() {
    const items: ListItem[] = [
        {
            id: 1,
            key: 1,
            label: "Request Quote",
            icon: <IconGoogleIcon SVGIcons={RequestQuote} />
        },
        {
            id: 2,
            key: 2,
            label: "Send Money",
            icon: <IconGoogleIcon SVGIcons={SendMoney} />,
            children: [
                {
                    id: "2-1",
                    key: "2-1",
                    label: "Send Money",
                    children: [
                        {
                            id: "2-1-1",
                            key: "2-1-1",
                            label: "Send Money 1",
                            children: [
                                { id: "2-1-1-1", key: "2-1-1-1", label: "Send Money 1-1" },
                                { id: "2-1-1-2", key: "2-1-1-2", label: "Send Money 1-2" },
                            ]
                        },
                        {
                            id: "2-1-2",
                            key: "2-1-2",
                            label: "Send Money 2",
                            children: [
                                { id: "2-1-2-1", key: "2-1-2-1", label: "Send Money 2-1" },
                                { id: "2-1-2-2", key: "2-1-2-2", label: "Send Money 2-2" },
                            ]
                        },
                    ]
                }
            ]
        },
        {
            id: 4,
            key: 4,
            label: 'Sales Report',
            children: [
                { id: '4-1', key: '4-1', label: 'Platform Daily Report' },
                { id: '4-2', key: '4-2', label: 'Platform Monthly Report' },
                { id: '4-3', key: '4-3', label: 'Merchant Daily Report' },
                { id: '4-4', key: '4-4', label: 'Merchant Monthly Report' },
                // { id: '4-2', label: 'Platform Monthly Report' },
                // { id: '4-3', label: 'Merchant Daily Report' },
                // { id: '4-4', label: 'Merchant Monthly Report' },
            ],
            icon: <IconGoogleIcon SVGIcons={BarChart} />
        },
    ]

    return (
        <div className="flex grow shrink min-h-screen">
            <div className="shrink border-r border-gray-200 flex flex-col">
                <div className="min-h-[48px] flex items-center justify-center">
                    logo
                </div>
                <CollapseSideBar
                    items={items}
                />
                {/* <SideBar
                    items={items}
                    initialExpanded={true}
                    childExpandType={ChildExpandType.Single}
                /> */}
            </div>
            <div className="h-full w-[2px] bg-gray-200" />
            <div className="grow shrink flex flex-col">
                <div className="min-h-[48px]">
                    head
                </div>
                <div className="h-[1px] bg-gray-200 w-full" />
                <div className="grow shrink flex flex-col">
                    <div className="grow shrink">
                        content
                    </div>
                    <div className="h-[1px] bg-gray-200 w-full" />
                    <div className="min-h-[48px]">
                        footer
                    </div>
                </div>
            </div>
        </div>
    );
}