import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem,Avatar } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import './Topbar.css'; // Importe o arquivo CSS aqui

const TopbarItem = ({ title, to, icon, logoutFunction }) => (
  <Button
    color="inherit"
    startIcon={icon}
    component={to ? Link : 'button'}
    to={to}
    onClick={logoutFunction}
    className="topbarButton"
  >
    {title}
  </Button>
);

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="appBar">
      <Toolbar>
      <Box sx={{ flexGrow: 0.01 }}>
  <Avatar />
      </Box>
       
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="topbarTitle">
          {user.Name || "Nome do Utilizador"}
        </Typography>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={Link} to="/">Dashboard</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/ticket">Serviços</MenuItem>
          <MenuItem onClick={() => {
            handleClose();
            logout();
          }}>Logout</MenuItem>
        </Menu>

        <TopbarItem title="Dashboard" to="/" icon={<HomeOutlinedIcon />} />
        <TopbarItem title="Serviços" to="/ticket" icon={<ArticleIcon />} />
        <TopbarItem title="Logout" icon={<MapOutlinedIcon />} logoutFunction={logout} />
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
