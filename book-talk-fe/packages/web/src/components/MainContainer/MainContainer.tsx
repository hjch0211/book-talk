import {type ReactNode, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import {meQueryOption} from "../../apis/account";
import {useQuery} from "@tanstack/react-query";
import {StyledContainer} from "./MainContainer.style.ts";

interface MainContainerProps {
    children: ReactNode;
    bgColor?: string;
    isAuthPage?: boolean;
}

const MainContainer = ({children, isAuthPage = false}: MainContainerProps) => {
    const {data: account, isLoading} = useQuery(meQueryOption);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthPage && !account) {
            navigate('/');
        }
    }, [isAuthPage, account, isLoading, navigate])

    return (
        <StyledContainer maxWidth={false} disableGutters>
            {children}
        </StyledContainer>
    );
};

export default MainContainer;