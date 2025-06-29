import { FC, HTMLAttributes, SVGProps } from "react";

const IconGoogleIcon = ({ SVGIcons, ...props }: HTMLAttributes<HTMLDivElement> & { SVGIcons: FC<SVGProps<SVGSVGElement>> }) => (
    <div {...props} >
        <SVGIcons width="1em" height="1em" fill="currentColor" />
    </div>
);

export { IconGoogleIcon }