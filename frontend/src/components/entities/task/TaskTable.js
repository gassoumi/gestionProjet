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
import moment from 'moment';

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


function getHeadCells(canEdit) {
    const headCells = [
        {id: 'project', numeric: false, align: 'left', disablePadding: false, label: 'Nom du Projet'},
        {id: 'description', numeric: false, align: 'left', disablePadding: false, label: 'Tache'},
        // {id: 'sprint', numeric: false, align: 'left', disablePadding: false, label: 'Nom du Sprint'},
        {id: 'user', numeric: false, align: 'left', disablePadding: false, label: 'Responsable'},
        {id: 'state', numeric: false, align: 'left', disablePadding: false, label: 'Statut'},
        {id: 'start_at', numeric: false, align: 'left', disablePadding: false, label: 'Date Début'},
        {id: 'end_at', numeric: false, align: 'left', disablePadding: false, label: 'Date Fin'},
    ];
    if (canEdit) {
        headCells.push(
            {id: 'action', numeric: true, align: 'right', disablePadding: false, label: ''}
        )
    }
    return headCells;
}


function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, canEdit} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {getHeadCells(canEdit).map((headCell) => (
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
                Taches
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

function TaskTable(props) {
    const {
        rows, count, handleEdit, handleDelete, page, pageSize: rowsPerPage, canEdit,
        fetchTasks
    } = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    //const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    //const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
        fetchTasks(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        //setRowsPerPage(parseInt(event.target.value, 10));
        //setPage(0);
        fetchTasks(1, parseInt(event.target.value, 10));
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const getStateElement = value => {
        let classes = "badge badge-pill badge-";
        switch (value) {
            case "A Faire":
                classes += "primary";
                break;
            case "En Cours":
                classes += "secondary";
                break;
            case "A Verifier":
                classes += "warning";
                break;
            case "Termine":
                classes += "success";
                break;
            case "Backlog":
                classes += "danger";
                break;
            default:
                classes += "warning";
        }
        return (
            <h5>
                <span className={classes}>{value}</span>
            </h5>
        );
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar dense={dense} handleChangeDense={handleChangeDense}
                                      numSelected={selected.length}/>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            canEdit={canEdit}
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
                                            // onClick={(event) => handleClick(event, row.name)}
                                            tabIndex={-1}
                                            key={row.description}
                                        >
                                            <TableCell align="left">{row.sprint.project.designation}</TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="default">
                                                {row.description}
                                            </TableCell>
                                            {/*<TableCell align="left">{row.sprint.name}</TableCell>*/}
                                            <TableCell align="left">{row.user.username}</TableCell>
                                            <TableCell align="left">{getStateElement(row.state)}</TableCell>
                                            <TableCell
                                                align="left">{moment(row.start_at).format(' DD MMMM YYYY')}
                                            </TableCell>
                                            <TableCell
                                                align="left">{moment(row.end_at).format(' DD MMMM YYYY')}
                                            </TableCell>
                                            {canEdit &&
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