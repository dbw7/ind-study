import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material';

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
    [theme.breakpoints.down(600)]: {
      display: "none"
    }
}));

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
    [theme.breakpoints.up(600)]: {
      display: "none",
    },
}));

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

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
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
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
          
          <StyledBox sx={{ flexGrow: 1, display:"flex", justifyContent:"right" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={buttonSX}
               >
                {page}
              </Button>
            ))}
          </StyledBox>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' }, marginLeft:"auto"}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <StyledMenuIcon />
            </IconButton>
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