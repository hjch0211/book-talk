import {type ReactNode} from "react";
import {StyledPageWrapper} from "./style.ts";

interface PageWrapperProps {
    children: ReactNode;
    bgColor?: string;
}

const PageWrapper = ({children, bgColor}: PageWrapperProps) => {
    return (
        <StyledPageWrapper bgColor={bgColor}>
            {children}
        </StyledPageWrapper>
    );
};

export default PageWrapper;
