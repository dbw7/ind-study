import './Leaderboard.css';
import LBTable from "../../components/LBTable/LBTable";

const Leaderboard =  () => {
    return(
        <div className="dashboard-main">
            <div className='data'>
                <LBTable></LBTable>
            </div>
        </div>
    )
}

export default Leaderboard;