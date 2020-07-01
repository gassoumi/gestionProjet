import React from 'react';
import Drawer from "@material-ui/core/Drawer/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Divider from "@material-ui/core/Divider";
import {makeStyles} from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ListIcon from '@material-ui/icons/List';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const renderLink = (to) => React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
);

function CollapseListItemLink(props) {
    const {primary, listTo} = props;
    const [open, setOpen] = React.useState(true);
    const classes = useStyles();

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <li>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={primary}/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {listTo.map((item, index) => (
                        <ListItem key={index} button component={renderLink(item.to)} className={classes.nested}>
                            {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
                            <ListItemText primary={item.text}/>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </li>
    );
}

function ListItemLink(props) {
    const {icon, primary, to} = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    );
}

ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

function Sidebar(props) {
    const classes = useStyles();
    const projectLink = [
        {
            to: "/project",
            text: 'Projects',
            icon: <ListIcon/>
        },
        {
            to: "/project/create",
            text: 'Create New',
            icon: <AddCircleIcon/>
        }
    ];
    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar/>
            <div className={classes.drawerContainer}>
                <List>
                    <CollapseListItemLink primary="Project" listTo={projectLink}/>
                </List>
                <Divider/>
                <List>
                    <ListItemLink to="#" primary="Sprint"/>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    );
}


export default Sidebar;