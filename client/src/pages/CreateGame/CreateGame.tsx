import "./CreateGame.css"
import CreateBox from "../../components/Box/CreateBox/CreateBox";
import { FC } from "react";
import useBackendTester from "../../hooks/useBackendTester";


const CreateGame: FC = () => {
    useBackendTester();
    return(
        <div className="board-big">
            <CreateBox></CreateBox>
        </div>
    )
}

export default CreateGame;