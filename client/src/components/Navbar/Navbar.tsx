import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
// @ts-ignore
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Icon, styled } from '@mui/material';
import { useNavigate } from 'react-router';
import AuthContext from '../../context/auth-context';
import { Link } from 'react-router-dom';

const pages = ['Home', 'About', 'Play'];
//const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const buttonSX  = {
    "&":{
        my: 2, 
        color: 'hsl(246,  6%, 55%)', 
        display: 'flex', 
        fontFamily:"inter",
        fontWeight: "600"
    },
    "&:hover": {
        backgroungColor: "rgba(25, 118, 210, 0.04)",
        color: "white",
        fontWeight: "700",
    },
};

const StyledBox = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down(651)]: {
      display: "none"
    }
}));

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
    [theme.breakpoints.up(651)]: {
      display: "none",
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.up(651)]: {
    display: "none",
  },
}));

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const authCtx  = React.useContext(AuthContext);
  
  const nav = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{background:"none", boxShadow:"none"}}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <img src='https://cdn-icons-png.flaticon.com/512/10281/10281803.png' width="50px"></img>
          
          <Link style={{
            textDecoration: "none",
            color: "white"
          }} to='/'>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontFamily: 'inter',
              fontWeight: 700,
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DBChess
          </Typography>
          </Link>
          
          <StyledBox sx={{ flexGrow: 1, display:"flex", justifyContent:"right" }}>
          <Button
                key={"Home"}
                onClick={()=>{
                  handleCloseNavMenu();
                  nav("/")
                }}
                sx={buttonSX}
               >
                {"Home"}
              </Button>
              <Button
                key={"About"}
                onClick={()=>{
                  handleCloseNavMenu()
                  nav("/about")
                }}
                sx={buttonSX}
               >
                {"About"}
              </Button>
              <Button
                key={"Play"}
                onClick={()=>{
                  handleCloseNavMenu()
                  if(authCtx.isLoggedIn){
                    nav("/create-game")
                  } else {
                    nav("/login")
                  }
                }}
                sx={buttonSX}
               >
                {"Play"}
              </Button>
              <Button
                key={"profile"}
                onClick={()=>{
                  handleCloseNavMenu()
                  if(authCtx.isLoggedIn){
                    nav("/profile")
                  } else {
                    nav("/login")
                  }
                }}
                sx={buttonSX}
               >
                {"Profile"}
              </Button>
              <Button
                key={"leaderboard"}
                onClick={()=>{
                  handleCloseNavMenu()
                  if(authCtx.isLoggedIn){
                    nav("/leaderboard")
                  } else {
                    nav("/login")
                  }
                }}
                sx={buttonSX}
               >
                {"LeaderBoard"}
              </Button>
              <Button
                key={"Play"}
                onClick={()=>{
                  handleCloseNavMenu()
                  authCtx.logout();
                }}
                sx={buttonSX}
               >
                {"Logout"}
              </Button>
          </StyledBox>
          
          <Box sx={{ display: { xs:'flex', md: 'none' }, marginLeft:"auto"}}>
            <StyledIconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <StyledMenuIcon />
            </StyledIconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography fontFamily="inter" fontWeight="600" textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;