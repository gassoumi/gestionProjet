import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import Link from '@material-ui/core/Link';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";


// TODO 8
// https://material-ui.com/components/links/#links
// TODO 7
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


function getHeadCells(displayEditButton) {
    const headCells = [
        {id: 'code', numeric: true, align: 'left', disablePadding: false, label: 'Code Document'},
        {id: 'description', numeric: false, align: 'left', disablePadding: false, label: 'Description Document'},
        {id: 'version', numeric: false, align: 'left', disablePadding: false, label: 'Version'},
        {id: 'tache', numeric: false, align: 'left', disablePadding: false, label: 'Tache'},
        {id: 'docFile', numeric: false, align: 'left', disablePadding: false, label: 'Fichier'},
    ];
    if (displayEditButton) {
        headCells.push(
            {id: 'action', numeric: true, align: 'right', disablePadding: false, label: ''}
        )
    }
    return headCells;
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, displayEditButton} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {getHeadCells(displayEditButton).map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        // align={headCell.numeric ? 'right' : 'left'}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {numSelected, dense, handleChangeDense} = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                Documents
            </Typography>

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    buttons: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export function getFileName(path) {
    if (typeof path !== "string") {
        return undefined;
    }
    const index = path.lastIndexOf("/");
    if (index > -1) {
        return path.substring(index + 1);
    }
    return path;
}

function TaskTable(props) {
    const {
        rows, count, handleEdit, handleDelete, page, pageSize: rowsPerPage, canEdit,
        fetchDocuments, displayEditButton,
    } = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(displayEditButton);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        //setPage(newPage);
        fetchDocuments(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        //setRowsPerPage(parseInt(event.target.value, 10));
        //setPage(0);
        fetchDocuments(1, parseInt(event.target.value, 10));
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar dense={dense} handleChangeDense={handleChangeDense}
                                      numSelected={selected.length}/>
                <TableContainer>
                    {/*<div className={classes.root}>*/}
                    {/*    <AppBar position="static">*/}
                    {/*        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">*/}
                    {/*            <Tab label="Documents avec tache" {...a11yProps(0)} />*/}
                    {/*            <Tab label="Documents sans tache" {...a11yProps(1)} />*/}
                    {/*        </Tabs>*/}
                    {/*    </AppBar>*/}
                    {/*    <TabPanel value={value} index={0}>*/}
                    {/*        Item One*/}
                    {/*    </TabPanel>*/}
                    {/*    <TabPanel value={value} index={1}>*/}
                    {/*        Item Two*/}
                    {/*    </TabPanel>*/}
                    {/*</div>*/}
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            displayEditButton={displayEditButton}
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell align="left">{row.code}</TableCell>
                                            <TableCell align="left">{row.description}</TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="default">
                                                {row.version}
                                            </TableCell>
                                             <TableCell align="left">
                                                 {row.task ? row.task.description : ""}
                                             </TableCell>
                                            <TableCell align="left">
                                                <Link target="_blank" rel="noreferrer" href={row.docFile}>
                                                    {getFileName(row.docFile)}
                                                </Link>
                                            </TableCell>
                                            {displayEditButton &&
                                            <TableCell align="right">
                                                <div className={classes.buttons}>
                                                    <Tooltip title="supprimer">
                                                        <IconButton
                                                            onClick={() => handleDelete(row)}
                                                            size={"small"}
                                                            aria-label="supprimer"
                                                            color="secondary">
                                                            <DeleteIcon fontSize={"small"}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="editer">

                                                        <IconButton
                                                            aria-label="editer"
                                                            onClick={() => handleEdit(row.id)}
                                                            size={"small"} color="primary">
                                                            <EditIcon fontSize={"small"}/>
                                                        </IconButton>

                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                            }
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default TaskTable;