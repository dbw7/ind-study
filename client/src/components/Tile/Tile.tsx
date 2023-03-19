import React from "react";
import './Tile.css'

import kb from "../../assets/images/king-b.png"
import rb from "../../assets/images/reg-b.png"
import kr from "../../assets/images/king-r.png"
import rr from "../../assets/images/reg-r.png"

type Tilex =  {
    occupiedBy: number,
    coordinate: string
}
interface Props {
    tile: Tilex
}

const Tile = ({tile}: Props) => {
    return <div className="piece">
        <img className="board-piece" src={kb}></img>
    </div>
}

export default Tile;