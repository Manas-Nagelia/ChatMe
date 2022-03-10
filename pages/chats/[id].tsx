import { NextPage } from "next";
import { useRouter } from "next/router"
import { SessionProps } from "../../interfaces/SessionProps";
import Sidebar from "../../modules/chat/components/Sidebar";
import useRouteGuard from "../../utils/guards/useRouteGuard"

const Chats: NextPage<SessionProps> = (props) => {
    useRouteGuard(props.session);

    const router = useRouter();
    const { id } = router.query;



    return (
        <Sidebar />
    )
};

export default Chats;