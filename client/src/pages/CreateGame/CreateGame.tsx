import "./CreateGame.css"
import CreateBox from "../../components/Box/CreateBox";
import { FC } from "react";


const CreateGame: FC = () => {
    return(
        <div className="board-big">
            <CreateBox></CreateBox>
        </div>
    )
}

export default CreateGame;