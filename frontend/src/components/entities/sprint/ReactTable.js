import React, {useEffect} from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableContainer from '@material-ui/core/TableContainer';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';

import {useTable, usePagination} from 'react-table';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


import Paper from "@material-ui/core/Paper/Paper";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Selector} from "../index";
import {connect} from "react-redux";
import {fetchSprints, deleteSprintById} from "../../../redux/actions";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    buttons: {
        '& > *': {
            margin: theme.spacing(1),
        },
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

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.grey[0],
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function Table({
                   columns, data, count, currentPage, fetchSprints,
                   pageCount: controlledPageCount, pageSize: controlledPageSize
               }) {
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [pageTable, setPageTable] = React.useState(0);
    const classes = useStyles();

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: {pageIndex, pageSize, sortBy, filters},
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 0, pageSize: 5}, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            pageCount: controlledPageCount,
        },
        usePagination
    );

    //console.log(pageSize);

    const handleChangePage = (event, newPage) => {
        //console.log(pageIndex);
        //console.log(newPage);
        console.log(newPage);
        console.log(pageIndex);
        //gotoPage(newPage);

        if (currentPage - 1 < newPage) {
            nextPage();
        } else {
            previousPage();
        }

    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setRowsPerPage(parseInt(event.target.value, 10));
        gotoPage(0);
    };

    //console.log(currentPage);

    useEffect(() => {
        const pageCurrent = currentPage !== 0 ? currentPage - 1 : 0;
        console.log(pageCurrent);
        setPageTable(pageCurrent);
        console.log(controlledPageSize);
        setRowsPerPage(controlledPageSize);
    }, [data]);

    React.useEffect(() => {
        //console.log(pageIndex);
        //console.log(pageSize);
        //console.log(pageIndex);
        //console.log(pageSize);
        setRowsPerPage(controlledPageSize);
        fetchSprints(pageIndex + 1, pageSize);
    }, [fetchSprints, pageIndex, pageSize]);

    /*
    React.useEffect(() => {
        const page = currentPage !== 0 ? currentPage - 1 : 0;
        console.log(page);
        setRowsPerPage(controlledPageSize);
        setPageTable(page);
    }, [controlledPageSize]);
     */

    console.log(pageIndex);

    // Render the UI for your table
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <MaUTable
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        aria-label="enhanced table" {...getTableProps()}>
                        <TableHead>
                            {headerGroups.map(headerGroup => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <StyledTableCell {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <TableRow hover {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return (
                                                <StyledTableCell {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </StyledTableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </MaUTable>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    page={pageTable}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Paper>
        </div>
    )
}

function ReactTable(props) {

    const classes = useStyles();
    // We'll start our table without any data
    const [data, setData] = React.useState([]);
    const [pageCount, setPageCount] = React.useState(0);
    const {
        pageSize, sprints, currentPage, count, isFetching,
        fetchSprints, handleEdit, handleDelete
    } = props;

    const columns = React.useMemo(
        () => [
            {
                Header: 'Nom du Sprint',
                accessor: 'name',
            },
            {
                Header: 'Nom du Projet',
                accessor: 'project',
                Cell: props => props.value.designation,
            },
            {
                Header: 'Date Souhaitée',
                accessor: 'desired_at',
                Cell: props => {
                    // DD MMMM YYYY, h:mm:ss a
                    return moment(props.value).format(' DD MMMM YYYY')
                }
            },
            {
                Header: 'Statue',
                accessor: 'state',
                Cell: props => {
                    let classes = "badge badge-pill badge-";
                    const value = props.value;
                    switch (value) {
                        case "Planifiè":
                            classes += "success";
                            break;
                        case "En Cours":
                            classes += "secondary";
                            break;
                        case "Cloturé":
                            classes += "primary";
                            break;
                        case "Archivé":
                            classes += "warning";
                            break;
                        default:
                            classes += "warning";
                    }
                    return (
                        <h5>
                            <span className={classes}>{value}</span>
                        </h5>
                    );
                }
            },
            {
                Header: 'Action',
                accessor: 'id',
                Cell: props => {
                    return (
                        <div className={classes.buttons}>
                            <IconButton onClick={() => handleDelete(props.value)}
                                        size={"small"}
                                        aria-label="delete"
                                        color="primary">
                                <DeleteIcon fontSize={"small"}/>
                            </IconButton>
                            <IconButton onClick={() => handleEdit(props.value)}
                                        size={"small"} color="secondary"
                                        aria-label="add an alarm">
                                <EditIcon fontSize={"small"}/>
                            </IconButton>
                        </div>
                    )
                }
            },
        ],
        []
    );

    useEffect(() => {
        const startRow = pageSize * (currentPage - 1);
        const endRow = startRow + pageSize;
        setData(sprints.slice(startRow, endRow));
        setPageCount(Math.ceil(count / pageSize));
    }, [sprints]);


    return (
        <React.Fragment>
            <CssBaseline/>
            <Table fetchSprints={fetchSprints}
                   currentPage={currentPage}
                   count={count}
                   loading={isFetching}
                   columns={columns}
                   pageCount={pageCount}
                   data={data}
                   pageSize={pageSize}
            />
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const {
        pagination: {sprint},
    } = state;
    //const listProjectIds = project.ids || [];
    const listSprint = Selector.getSprints(state);

    return {
        sprints: listSprint || [],
        nextPageUrl: sprint.nextPageUrl,
        currentPage: sprint.page,
        isFetching: sprint.isFetching,
        canEdit: state.auth.user.is_staff || false,
        count: sprint.count,
        pageSize: sprint.pageSize,
    };
};

export default connect(mapStateToProps, {fetchSprints})(ReactTable);