import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Typography } from "@mui/material";
import UserData from '../../types/UserData';
import useLeaderBoard from '../../hooks/useLeaderboard';

function createData(
    rank: number,
    name: string,
    rating: number,
    wdl: string,
) {
  return { rank, name, rating, wdl };
}

const rows = [
    createData(1, 'Name', 1600, '10-0-0'),
    createData(2, 'Name', 1600, '10-0-0'),
    createData(3, 'Name', 1600, '10-0-0'),
    createData(4, 'Name', 1600, '10-0-0'),
    createData(5, 'Name', 1600, '10-0-0'),
    createData(6, 'Name', 1600, '10-0-0'),
    createData(7, 'Name', 1600, '10-0-0'),
    createData(8, 'Name', 1600, '10-0-0'),
    createData(9, 'Name', 1600, '10-0-0'),
    createData(10, 'Name', 1600, '10-0-0'),
    createData(11, 'Name', 1600, '10-0-0'),
    createData(12, 'Name', 1600, '10-0-0'),
    
];

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    '&':{
      backgroundColor: "hsl(0deg 0% 100% / 4%)",
      maxHeight:"70vh",
    },
    "&::-webkit-scrollbar": {
        width: "7px",
        height: "7px"
      },
      "&::-webkit-scrollbar-track": {
          background: "#19252B" /*rgb(25, 37, 43)*/
      },
      "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#4E5D88" /*rgb(78, 93, 136)*/,
      }
    
}));
const HeaderTypography = styled(Typography)(({ theme }) => ({
    '&':{
      color:"white",
      fontWeight: "700",
      fontFamily: "inter"
    }
}));
const CellTypography = styled(Typography)(({ theme }) => ({
    '&':{
      color:"white",
      fontWeight: "500",
      fontFamily: "inter"
    }
}));

const LBTable = () => {
  const {userDataArrState, error} = useLeaderBoard();
  
  return (
    
    <>
    {error && 
    <Typography variant="h6" sx={{width:"50vw", textAlign:"center", position:"absolute", right:"25%", color:"white",fontFamily: "inter", fontWeight: "500",}}>Error getting leaderboard.<br></br><br></br>Try refreshing the page.</Typography>}
    {//@ts-ignore
    !error && <StyledTableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align='center'><HeaderTypography>Rank</HeaderTypography></TableCell>
            <TableCell align='center'><HeaderTypography>Player</HeaderTypography></TableCell>
            <TableCell align='center'><HeaderTypography>Rating</HeaderTypography></TableCell>
            <TableCell align='center'><HeaderTypography>Wins-Draws-Losses</HeaderTypography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userDataArrState && userDataArrState.map((row) => (
            <TableRow
            key={String(row.rank)}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row" align='center'>
              <CellTypography>{String(row.rank)}</CellTypography>
            </TableCell>
            <TableCell align='center'><CellTypography>{row.name}</CellTypography></TableCell>
            <TableCell align='center'><CellTypography>{String(row.rating)}</CellTypography></TableCell>
            <TableCell align='center'><CellTypography>{row.wins + "-" + row.draws+"-" + row.losses}</CellTypography></TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>}
    </>
  );
}

export default LBTable;