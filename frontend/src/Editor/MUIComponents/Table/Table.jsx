/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect, useCallback, useContext, useReducer, useRef } from 'react';
import {
  useTable,
  useFilters,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useBlockLayout,
  useResizeColumns,
  useRowSelect,
  useColumnOrder,
} from 'react-table';
import cx from 'classnames';
import { resolveReferences, validateWidget } from '@/_helpers/utils';
import { useExportData } from 'react-table-plugins';
import Papa from 'papaparse';
import { Pagination } from './Pagination';
import { Filter } from './Filter';
import { GlobalFilter } from './GlobalFilter';
var _ = require('lodash');
import loadPropertiesAndStyles from './load-properties-and-styles';
import { reducer, reducerActions, initialState } from './reducer';
import customFilter from './custom-filter';
import generateColumnsData from './columns';
import generateActionsData from './columns/actions';
import autogenerateColumns from './columns/autogenerateColumns';
import IndeterminateCheckbox from './IndeterminateCheckbox';
// eslint-disable-next-line import/no-unresolved
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-unresolved
import JsPDF from 'jspdf';
// eslint-disable-next-line import/no-unresolved
import 'jspdf-autotable';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// eslint-disable-next-line import/no-unresolved
import { IconEyeOff, IconNewSection } from '@tabler/icons-react';
import * as XLSX from 'xlsx/xlsx.mjs';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useMounted } from '@/_hooks/use-mount';
import GenerateEachCellValue from './GenerateEachCellValue';
// eslint-disable-next-line import/no-unresolved
import { toast } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { AddNewRowComponent } from './AddNewRowComponent';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import MUITable from '@mui/material/Table';
import { AddCircleOutline, Download, FilterList, ViewWeek } from '@mui/icons-material';
import MUITooltip from '@mui/material/Tooltip';

// utilityForNestedNewRow function is used to construct nested object while adding or updating new row when '.' is present in column key for adding new row
const utilityForNestedNewRow = (row) => {
  let arr = Object.keys(row);
  let obj = {};
  arr.forEach((key) => {
    let nestedKeys = key.split('.');
    let tempObj = obj;

    for (let i = 0; i < nestedKeys.length; i++) {
      let nestedKey = nestedKeys[i];

      if (!tempObj.hasOwnProperty(nestedKey)) {
        tempObj[nestedKey] = i === nestedKeys.length - 1 ? '' : {};
      }

      tempObj = tempObj[nestedKey];
    }
  });
  return obj;
};

const MenuCustom = ({ children, Icon, titleTooltip }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <MUITooltip title={titleTooltip}>
        <IconButton onClick={handleClick}>{Icon}</IconButton>
      </MUITooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {children}
      </Menu>
    </>
  );
};

export function Table({
  id,
  width,
  height,
  component,
  onComponentClick,
  currentState = { components: {} },
  onEvent,
  paramUpdated,
  changeCanDrag,
  onComponentOptionChanged,
  onComponentOptionsChanged,
  darkMode,
  fireEvent,
  setExposedVariable,
  setExposedVariables,
  registerAction,
  styles,
  properties,
  variablesExposedForPreview,
  exposeToCodeHinter,
  events,
  setProperty,
  mode,
  exposedVariables,
}) {
  const {
    color,
    serverSidePagination,
    clientSidePagination,
    serverSideSearch,
    serverSideSort,
    serverSideFilter,
    displaySearchBox,
    showDownloadButton,
    showFilterButton,
    showBulkUpdateActions,
    showBulkSelector,
    highlightSelectedRow,
    loadingState,
    columnSizes,
    tableType,
    cellSize,
    borderRadius,
    parsedWidgetVisibility,
    parsedDisabledState,
    actionButtonRadius,
    actions,
    enableNextButton,
    enablePrevButton,
    totalRecords,
    rowsPerPage,
    enabledSort,
    hideColumnSelectorButton,
    defaultSelectedRow,
    showAddNewRowButton,
    allowSelection,
  } = loadPropertiesAndStyles(properties, styles, darkMode, component);

  const updatedDataReference = useRef([]);
  const preSelectRow = useRef(false);

  const getItemStyle = ({ isDragging, isDropAnimating }, draggableStyle) => ({
    ...draggableStyle,
    userSelect: 'none',
    background: isDragging ? 'rgba(77, 114, 250, 0.2)' : '',
    top: 'auto',
    borderRadius: '4px',
    ...(isDragging && {
      marginLeft: '-120px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '10px',
      height: '30px',
    }),
    ...(!isDragging && { transform: 'translate(0,0)', width: '100%' }),
    ...(isDropAnimating && { transitionDuration: '0.001s' }),
  });
  const { t } = useTranslation();

  const [tableDetails, dispatch] = useReducer(reducer, initialState());
  const [hoverAdded, setHoverAdded] = useState(false);
  const [generatedColumn, setGeneratedColumn] = useState([]);
  const mergeToTableDetails = (payload) => dispatch(reducerActions.mergeToTableDetails(payload));
  const mergeToFilterDetails = (payload) => dispatch(reducerActions.mergeToFilterDetails(payload));
  const mergeToAddNewRowsDetails = (payload) => dispatch(reducerActions.mergeToAddNewRowsDetails(payload));
  const mounted = useMounted();

  const prevDataFromProps = useRef();
  useEffect(() => {
    if (mounted) prevDataFromProps.current = properties.data;
  }, [JSON.stringify(properties.data)]);

  useEffect(() => {
    setExposedVariable(
      'filters',
      tableDetails.filterDetails.filters.map((filter) => filter.value)
    );
  }, [JSON.stringify(tableDetails?.filterDetails?.filters)]);

  useEffect(
    () => mergeToTableDetails({ columnProperties: component?.definition?.properties?.columns?.value }),
    [component?.definition?.properties]
  );

  useEffect(() => {
    const hoverEvent = component?.definition?.events?.find((event) => {
      return event?.eventId == 'onRowHovered';
    });
    if (hoverEvent?.eventId) {
      setHoverAdded(true);
    }
  }, [JSON.stringify(component.definition.events)]);

  function showFilters() {
    mergeToFilterDetails({ filtersVisible: true });
  }

  function hideFilters() {
    mergeToFilterDetails({ filtersVisible: false });
  }

  function showAddNewRowPopup() {
    mergeToAddNewRowsDetails({ addingNewRows: true });
  }

  function hideAddNewRowPopup() {
    mergeToAddNewRowsDetails({ addingNewRows: false });
  }

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 60,
      width: 268,
    }),
    []
  );

  function handleExistingRowCellValueChange(index, key, value, rowData) {
    const changeSet = tableDetails.changeSet;
    const dataUpdates = tableDetails.dataUpdates || [];
    const clonedTableData = _.cloneDeep(tableData);

    let obj = changeSet ? changeSet[index] || {} : {};
    obj = _.set(obj, key, value);

    let newChangeset = {
      ...changeSet,
      [index]: {
        ...obj,
      },
    };

    obj = _.set({ ...rowData }, key, value);

    let newDataUpdates = {
      ...dataUpdates,
      [index]: { ...obj },
    };

    Object.keys(newChangeset).forEach((key) => {
      clonedTableData[key] = {
        ..._.merge(clonedTableData[key], newChangeset[key]),
      };
    });

    const changesToBeSavedAndExposed = { dataUpdates: newDataUpdates, changeSet: newChangeset };
    mergeToTableDetails(changesToBeSavedAndExposed);
    fireEvent('onCellValueChanged');
    return setExposedVariables({ ...changesToBeSavedAndExposed, updatedData: clonedTableData });
  }

  const copyOfTableDetails = useRef(tableDetails);
  useEffect(() => {
    copyOfTableDetails.current = _.cloneDeep(tableDetails);
  }, [JSON.stringify(tableDetails)]);

  function handleNewRowCellValueChange(index, key, value, rowData) {
    const changeSet = copyOfTableDetails.current.addNewRowsDetails.newRowsChangeSet || {};
    const dataUpdates = copyOfTableDetails.current.addNewRowsDetails.newRowsDataUpdates || {};
    let obj = changeSet ? changeSet[index] || {} : {};
    obj = _.set(obj, key, value);
    let newChangeset = {
      ...changeSet,
      [index]: {
        ...obj,
      },
    };

    if (Object.keys(rowData).find((key) => key.includes('.'))) {
      rowData = utilityForNestedNewRow(rowData);
    }
    obj = _.merge({}, rowData, obj);

    let newDataUpdates = {
      ...dataUpdates,
      [index]: { ...obj },
    };
    const changesToBeSaved = { newRowsDataUpdates: newDataUpdates, newRowsChangeSet: newChangeset };
    const changesToBeExposed = Object.keys(newDataUpdates).reduce((accumulator, row) => {
      accumulator.push({ ...newDataUpdates[row] });
      return accumulator;
    }, []);
    mergeToAddNewRowsDetails(changesToBeSaved);
    return setExposedVariables({ newRows: changesToBeExposed });
  }

  function getExportFileBlob({ columns, fileType, fileName }) {
    let headers = columns.map((column) => {
      return {
        exportValue: String(column.exportValue),
        key: column.key ? String(column.key) : column.key,
      };
    });
    let data = globalFilteredRows.map((row) => {
      return headers.reduce((accumulator, header) => {
        let value = undefined;
        if (header.key && header.key !== header.exportValue) {
          value = _.get(row.original, header.key);
        } else {
          value = _.get(row.original, header.exportValue);
        }
        accumulator.push(value);
        return accumulator;
      }, []);
    });
    headers = headers.map((header) => header.exportValue.toUpperCase());
    if (fileType === 'csv') {
      const csvString = Papa.unparse({ fields: headers, data });
      return new Blob([csvString], { type: 'text/csv' });
    } else if (fileType === 'pdf') {
      const pdfData = data.map((obj) => Object.values(obj));
      const doc = new JsPDF();
      doc.autoTable({
        head: [headers],
        body: pdfData,
        styles: {
          minCellHeight: 9,
          minCellWidth: 20,
          fontSize: 11,
          color: 'black',
        },
        theme: 'grid',
      });
      doc.save(`${fileName}.pdf`);
      return;
    } else if (fileType === 'xlsx') {
      data.unshift(headers); //adding headers array at the beginning of data
      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws1, 'React Table Data');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      // Returning false as downloading of file is already taken care of
      return false;
    }
  }

  function onPageIndexChanged(page) {
    onComponentOptionChanged(component, 'pageIndex', page).then(() => {
      onEvent('onPageChanged', { component, data: {} });
    });
  }

  function handleChangesSaved() {
    const clonedTableData = _.cloneDeep(tableData);
    Object.keys(changeSet).forEach((key) => {
      clonedTableData[key] = {
        ..._.merge(clonedTableData[key], changeSet[key]),
      };
    });
    updatedDataReference.current = _.cloneDeep(clonedTableData);

    setExposedVariables({
      changeSet: {},
      dataUpdates: [],
    }).then(() => mergeToTableDetails({ dataUpdates: {}, changeSet: {} }));
  }

  function handleChangesDiscarded() {
    setExposedVariables({
      changeSet: {},
      dataUpdates: [],
    }).then(() => {
      mergeToTableDetails({ dataUpdates: {}, changeSet: {} });
      fireEvent('onCancelChanges');
    });
  }

  const changeSet = tableDetails?.changeSet ?? {};

  const computeFontColor = useCallback(() => {
    if (color !== undefined) {
      return color;
    } else {
      return darkMode ? '#ffffff' : '#000000';
    }
  }, [color, darkMode]);

  let tableData = [],
    dynamicColumn = [];

  const useDynamicColumn = resolveReferences(component.definition.properties?.useDynamicColumn?.value, currentState);
  if (currentState) {
    tableData = resolveReferences(component.definition.properties.data.value, currentState, []);
    dynamicColumn = useDynamicColumn
      ? resolveReferences(component.definition.properties?.columnData?.value, currentState, []) ?? []
      : [];
    if (!Array.isArray(tableData)) tableData = [];
  }

  tableData = tableData || [];

  const tableRef = useRef();

  let columnData = generateColumnsData({
    columnProperties: useDynamicColumn ? generatedColumn : component.definition.properties.columns.value,
    columnSizes,
    currentState,
    handleCellValueChange: handleExistingRowCellValueChange,
    customFilter,
    defaultColumn,
    changeSet: tableDetails.changeSet,
    tableData,
    variablesExposedForPreview,
    exposeToCodeHinter,
    id,
    fireEvent,
    tableRef,
    t,
    darkMode,
  });

  columnData = useMemo(
    () =>
      columnData.filter((column) => {
        if (resolveReferences(column.columnVisibility, currentState)) {
          return column;
        }
      }),
    [columnData, currentState]
  );

  const columnDataForAddNewRows = generateColumnsData({
    columnProperties: useDynamicColumn ? generatedColumn : component.definition.properties.columns.value,
    columnSizes,
    currentState,
    handleCellValueChange: handleNewRowCellValueChange,
    customFilter,
    defaultColumn,
    changeSet: tableDetails.addNewRowsDetails.newRowsChangeSet,
    tableData,
    variablesExposedForPreview,
    exposeToCodeHinter,
    id,
    fireEvent,
    tableRef,
    t,
    darkMode,
  });

  const [leftActionsCellData, rightActionsCellData] = useMemo(
    () =>
      generateActionsData({
        actions,
        columnSizes,
        defaultColumn,
        fireEvent,
        setExposedVariables,
      }),
    [JSON.stringify(actions)]
  );

  const textWrapActions = (id) => {
    let wrapOption = tableDetails.columnProperties?.find((item) => {
      return item?.id == id;
    });
    return wrapOption?.textWrap;
  };

  const optionsData = columnData.map((column) => column.columnOptions?.selectOptions);
  const columns = useMemo(
    () => {
      return [...leftActionsCellData, ...columnData, ...rightActionsCellData];
    },
    [
      JSON.stringify(columnData),
      JSON.stringify(tableData),
      JSON.stringify(actions),
      leftActionsCellData.length,
      rightActionsCellData.length,
      tableDetails.changeSet,
      JSON.stringify(optionsData),
      JSON.stringify(component.definition.properties.columns),
      showBulkSelector,
      JSON.stringify(variablesExposedForPreview && variablesExposedForPreview[id]),
      darkMode,
      allowSelection,
      highlightSelectedRow,
    ] // Hack: need to fix
  );

  const columnsForAddNewRow = useMemo(() => {
    return [...columnDataForAddNewRows];
  }, [JSON.stringify(columnDataForAddNewRows), darkMode, tableDetails.addNewRowsDetails.addingNewRows]);

  const data = useMemo(() => {
    if (!_.isEqual(properties.data, prevDataFromProps.current)) {
      if (!_.isEmpty(updatedDataReference.current)) updatedDataReference.current = [];
      if (
        !_.isEmpty(exposedVariables.newRows) ||
        !_.isEmpty(tableDetails.addNewRowsDetails.newRowsDataUpdates) ||
        tableDetails.addNewRowsDetails.addingNewRows
      ) {
        setExposedVariable('newRows', []).then(() => {
          mergeToAddNewRowsDetails({
            newRowsDataUpdates: {},
            newRowsChangeSet: {},
            addingNewRows: false,
          });
        });
      }
    }
    return _.isEmpty(updatedDataReference.current) ? tableData : updatedDataReference.current;
  }, [tableData.length, component.definition.properties.data.value, JSON.stringify(properties.data)]);

  useEffect(() => {
    if (
      tableData.length != 0 &&
      component.definition.properties.autogenerateColumns?.value &&
      (useDynamicColumn || mode === 'edit')
    ) {
      const generatedColumnFromData = autogenerateColumns(
        tableData,
        component.definition.properties.columns.value,
        component.definition.properties?.columnDeletionHistory?.value ?? [],
        useDynamicColumn,
        dynamicColumn,
        setProperty,
        component.definition.properties.autogenerateColumns?.generateNestedColumns ?? false
      );

      useDynamicColumn && setGeneratedColumn(generatedColumnFromData);
    }
  }, [JSON.stringify(tableData), JSON.stringify(dynamicColumn)]);

  const computedStyles = {
    // width: `${width}px`,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    state,
    rows,
    prepareRow,
    setAllFilters,
    preGlobalFilteredRows,
    setGlobalFilter,
    allColumns,
    setColumnOrder,
    state: { pageIndex, globalFilter },
    exportData,
    selectedFlatRows,
    globalFilteredRows,
    getToggleHideAllColumnsProps,
    toggleRowSelected,
    toggleAllRowsSelected,
  } = useTable(
    {
      autoResetPage: false,
      autoResetGlobalFilter: false,
      autoResetHiddenColumns: false,
      autoResetFilters: false,
      manualGlobalFilter: serverSideSearch,
      manualFilters: serverSideFilter,
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: -1 },
      pageCount: -1,
      manualPagination: false,
      getExportFileBlob,
      disableSortBy: !enabledSort,
      manualSortBy: serverSideSort,
      stateReducer: (newState, action, prevState) => {
        const newStateWithPrevSelectedRows = showBulkSelector
          ? {
              ...newState,
              selectedRowId: { ...prevState.selectedRowIds, ...newState.selectedRowIds },
            }
          : { ...newState.selectedRowId };
        if (action.type === 'toggleRowSelected') {
          prevState.selectedRowIds[action.id]
            ? (newState.selectedRowIds = {
                ...newStateWithPrevSelectedRows.selectedRowIds,
                [action.id]: false,
              })
            : (newState.selectedRowIds = {
                ...newStateWithPrevSelectedRows.selectedRowIds,
                [action.id]: true,
              });
        }
        return newState;
      },
    },
    useColumnOrder,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useBlockLayout,
    useResizeColumns,
    useExportData,
    useRowSelect,
    (hooks) => {
      allowSelection &&
        !highlightSelectedRow &&
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            Header: ({ getToggleAllPageRowsSelectedProps }) => {
              const { title, ...rest } = { ...getToggleAllPageRowsSelectedProps() };

              return (
                <div className="d-flex flex-column align-items-center">
                  {showBulkSelector && (
                    <IndeterminateCheckbox
                      title={t(
                        'widget.Table.toggleAllCurrentPageRowsSelected',
                        'Toggle All Current Page Rows Selected'
                      )}
                      {...rest}
                    />
                  )}
                </div>
              );
            },
            Cell: ({ row }) => {
              const { title, ...rest } = { ...row.getToggleRowSelectedProps() };
              return (
                <div className="d-flex flex-column align-items-center">
                  <IndeterminateCheckbox
                    title={t('widget.Table.toggleRowSelected', 'Toggle Row Selected')}
                    {...rest}
                  />
                </div>
              );
            },
            width: 1,
            columnType: 'selector',
          },
          ...columns,
        ]);
    }
  );
  const currentColOrder = React.useRef();

  const sortOptions = useMemo(() => {
    if (state?.sortBy?.length === 0) {
      return;
    }

    const columnName = columns.find((column) => column.id === state?.sortBy?.[0]?.id).accessor;

    return [
      {
        column: columnName,
        direction: state?.sortBy?.[0]?.desc ? 'desc' : 'asc',
      },
    ];
  }, [JSON.stringify(state)]);

  const getDetailsOfPreSelectedRow = () => {
    const key = Object?.keys(defaultSelectedRow)[0] ?? '';
    const value = defaultSelectedRow?.[key] ?? undefined;
    const preSelectedRowDetails = rows.find((row) => row?.original?.[key] === value);
    return preSelectedRowDetails;
  };

  useEffect(() => {
    if (!sortOptions) {
      setExposedVariable('sortApplied', []);
    }
    if (mounted) setExposedVariable('sortApplied', sortOptions).then(() => fireEvent('onSort'));
  }, [sortOptions]);

  registerAction(
    'setPage',
    async function (targetPageIndex) {
      setPaginationInternalPageIndex(targetPageIndex);
      setExposedVariable('pageIndex', targetPageIndex);
      if (!serverSidePagination && clientSidePagination) gotoPage(targetPageIndex - 1);
    },
    [serverSidePagination, clientSidePagination, setPaginationInternalPageIndex]
  );
  registerAction(
    'selectRow',
    async function (key, value) {
      const item = tableData.filter((item) => item[key] == value);
      const row = rows.find((item, index) => item.original[key] == value);
      if (row != undefined) {
        const selectedRowDetails = { selectedRow: item[0], selectedRowId: row.id };
        setExposedVariables(selectedRowDetails).then(() => {
          toggleRowSelected(row.id);
          mergeToTableDetails(selectedRowDetails);
          fireEvent('onRowClicked');
        });
      }
    },
    [JSON.stringify(tableData), JSON.stringify(tableDetails.selectedRow)]
  );
  registerAction(
    'deselectRow',
    async function () {
      if (!_.isEmpty(tableDetails.selectedRow)) {
        const selectedRowDetails = { selectedRow: {}, selectedRowId: {} };
        setExposedVariables(selectedRowDetails).then(() => {
          if (allowSelection && !showBulkSelector) toggleRowSelected(tableDetails.selectedRowId, false);
          mergeToTableDetails(selectedRowDetails);
        });
      }
      return;
    },
    [JSON.stringify(tableData), JSON.stringify(tableDetails.selectedRow)]
  );
  registerAction(
    'discardChanges',
    async function () {
      if (Object.keys(tableDetails.changeSet || {}).length > 0) {
        setExposedVariables({
          changeSet: {},
          dataUpdates: [],
        }).then(() => {
          mergeToTableDetails({ dataUpdates: {}, changeSet: {} });
        });
      }
    },
    [JSON.stringify(tableData), JSON.stringify(tableDetails.changeSet)]
  );
  registerAction(
    'discardNewlyAddedRows',
    async function () {
      if (
        tableDetails.addNewRowsDetails.addingNewRows &&
        (Object.keys(tableDetails.addNewRowsDetails.newRowsChangeSet || {}).length > 0 ||
          Object.keys(tableDetails.addNewRowsDetails.newRowsDataUpdates || {}).length > 0)
      ) {
        setExposedVariables({
          newRows: [],
        }).then(() => {
          mergeToAddNewRowsDetails({
            newRowsChangeSet: {},
            newRowsDataUpdates: {},
            addingNewRows: false,
          });
        });
      }
    },
    [
      JSON.stringify(tableDetails.addNewRowsDetails.newRowsChangeSet),
      tableDetails.addNewRowsDetails.addingNewRows,
      JSON.stringify(tableDetails.addNewRowsDetails.newRowsDataUpdates),
    ]
  );
  useEffect(() => {
    if (showBulkSelector) {
      const selectedRowsOriginalData = selectedFlatRows.map((row) => row.original);
      const selectedRowsId = selectedFlatRows.map((row) => row.id);
      setExposedVariables({
        selectedRows: selectedRowsOriginalData,
        selectedRowsId: selectedRowsId,
      }).then(() => {
        const selectedRowsDetails = selectedFlatRows.reduce((accumulator, row) => {
          accumulator.push({ selectedRowId: row.id, selectedRow: row.original });
          return accumulator;
        }, []);
        mergeToTableDetails({ selectedRowsDetails });
      });
    }
    if (
      (!showBulkSelector && !highlightSelectedRow) ||
      (showBulkSelector && !highlightSelectedRow && preSelectRow.current)
    ) {
      const selectedRow = selectedFlatRows?.[0]?.original ?? {};
      const selectedRowId = selectedFlatRows?.[0]?.id ?? null;
      setExposedVariables({ selectedRow, selectedRowId }).then(() => {
        mergeToTableDetails({ selectedRow, selectedRowId });
      });
    }
  }, [selectedFlatRows.length, selectedFlatRows]);

  registerAction(
    'downloadTableData',
    async function (format) {
      exportData(format, true);
    },
    [_.toString(globalFilteredRows), columns]
  );

  useEffect(() => {
    if (mounted) {
      setExposedVariables({
        selectedRows: [],
        selectedRowsId: [],
        selectedRow: {},
        selectedRowId: null,
      }).then(() => {
        mergeToTableDetails({ selectedRowsDetails: [], selectedRow: {}, selectedRowId: null });
        toggleAllRowsSelected(false);
      });
    }
  }, [showBulkSelector, highlightSelectedRow, allowSelection]);

  React.useEffect(() => {
    if (serverSidePagination || !clientSidePagination) {
      setPageSize(rows?.length || 10);
    }
    if (!serverSidePagination && clientSidePagination) {
      setPageSize(rowsPerPage || 10);
    }
  }, [clientSidePagination, serverSidePagination, rows, rowsPerPage]);
  useEffect(() => {
    const pageData = page.map((row) => row.original);
    if (preSelectRow.current) {
      preSelectRow.current = false;
    } else {
      onComponentOptionsChanged(component, [
        ['currentPageData', pageData],
        ['currentData', data],
        ['selectedRow', []],
        ['selectedRowId', null],
      ]).then(() => {
        if (tableDetails.selectedRowId || !_.isEmpty(tableDetails.selectedRowDetails)) {
          toggleAllRowsSelected(false);
          mergeToTableDetails({ selectedRow: {}, selectedRowId: null, selectedRowDetails: [] });
        }
      });
    }
  }, [tableData.length, _.toString(page), pageIndex, _.toString(data)]);

  useEffect(() => {
    const newColumnSizes = { ...columnSizes, ...state.columnResizing.columnWidths };
    if (!state.columnResizing.isResizingColumn && !_.isEmpty(newColumnSizes)) {
      changeCanDrag(true);
      paramUpdated(id, 'columnSizes', {
        value: newColumnSizes,
      });
    } else {
      changeCanDrag(false);
    }
  }, [state.columnResizing.isResizingColumn]);

  const [paginationInternalPageIndex, setPaginationInternalPageIndex] = useState(pageIndex ?? 1);
  const [rowDetails, setRowDetails] = useState();
  useEffect(() => {
    if (pageCount <= pageIndex) gotoPage(pageCount - 1);
  }, [pageCount]);

  const hoverRef = useRef();

  useEffect(() => {
    if (rowDetails?.hoveredRowId !== '' && hoverRef.current !== rowDetails?.hoveredRowId) rowHover();
  }, [rowDetails]);

  useEffect(() => {
    setExposedVariable(
      'filteredData',
      globalFilteredRows.map((row) => row.original)
    );
  }, [JSON.stringify(globalFilteredRows.map((row) => row.original))]);

  const rowHover = () => {
    mergeToTableDetails(rowDetails);
    setExposedVariables(rowDetails).then(() => {
      fireEvent('onRowHovered');
    });
  };
  useEffect(() => {
    if (_.isEmpty(changeSet)) {
      setExposedVariable(
        'updatedData',
        _.isEmpty(updatedDataReference.current) ? tableData : updatedDataReference.current
      );
    }
  }, [JSON.stringify(changeSet)]);
  useEffect(() => {
    if (
      allowSelection &&
      typeof defaultSelectedRow === 'object' &&
      !_.isEmpty(defaultSelectedRow) &&
      !_.isEmpty(data)
    ) {
      const preSelectedRowDetails = getDetailsOfPreSelectedRow();
      if (_.isEmpty(preSelectedRowDetails)) return;

      const selectedRow = preSelectedRowDetails?.original ?? {};
      const selectedRowId = preSelectedRowDetails?.id ?? null;
      const pageNumber = Math.floor(selectedRowId / rowsPerPage) + 1;
      preSelectRow.current = true;
      if (highlightSelectedRow) {
        setExposedVariables({ selectedRow: selectedRow, selectedRowId: selectedRowId }).then(() => {
          toggleRowSelected(selectedRowId, true);
          mergeToTableDetails({ selectedRow: selectedRow, selectedRowId: selectedRowId });
        });
      } else {
        toggleRowSelected(selectedRowId, true);
      }
      if (pageIndex >= 0 && pageNumber !== pageIndex + 1) {
        gotoPage(pageNumber - 1);
      }
    }

    //hack : in the initial render, data is undefined since, upon feeding data to the table from some query, query inside current state is {}. Hence we added data in the dependency array, now question is should we add data or rows?
  }, [JSON.stringify(defaultSelectedRow), JSON.stringify(data)]);

  function downlaodPopover() {
    return (
      <Popover
        id="popover-basic"
        data-cy="popover-card"
        className={`${darkMode && 'popover-dark-themed theme-dark'} shadow table-widget-download-popup`}
        placement="bottom"
      >
        <Popover.Body>
          <div className="d-flex flex-column">
            <span
              data-cy={`option-download-CSV`}
              className="cursor-pointer"
              onClick={() => exportData('csv', true)}
            >
              {t('widget.Table.download', 'Download As')} CSV
            </span>
            <span
              data-cy={`option-download-execel`}
              className="pt-2 cursor-pointer"
              onClick={() => exportData('xlsx', true)}
            >
              {t('widget.Table.download', 'Download As')} Excel
            </span>
            <span
              data-cy={`option-download-pdf`}
              className="pt-2 cursor-pointer"
              onClick={() => exportData('pdf', true)}
            >
              {t('widget.Table.download', 'Download As')} PDF
            </span>
          </div>
        </Popover.Body>
      </Popover>
    );
  }

  return (
    <Box
      className="card jet-table"
      sx={{
        width: `100%`,
        height: `${height}px`,
        display: parsedWidgetVisibility ? '' : 'none',
        overflow: 'hidden',
        borderRadius: Number.parseFloat(borderRadius),
        boxShadow: styles.boxShadow,
        backgroundColor: 'white',
      }}
      onClick={(event) => {
        onComponentClick(id, component, event);
      }}
      ref={tableRef}
    >
      {/* Show top bar unless search box is disabled and server pagination is enabled */}
      {(displaySearchBox || showDownloadButton || showFilterButton || showAddNewRowButton) && (
        <Box
          display={width > 470 ? 'flex' : 'block'}
          justifyContent="space-between"
          padding="10px"
        >
          {displaySearchBox && (
            <GlobalFilter
              globalFilter={state.globalFilter}
              useAsyncDebounce={useAsyncDebounce}
              setGlobalFilter={setGlobalFilter}
              onComponentOptionChanged={onComponentOptionChanged}
              component={component}
              onEvent={onEvent}
              darkMode={darkMode}
            />
          )}
          <Box
            display={width < 470 ? 'flex' : ''}
            justifyContent="center"
          >
            {showAddNewRowButton && (
              <MUITooltip
                title={tableDetails.addNewRowsDetails.addingNewRows ? '' : t('widget.Table.addRow', 'Add new row')}
              >
                <IconButton
                  onClick={(e) => {
                    showAddNewRowPopup();
                  }}
                  disabled={tableDetails.addNewRowsDetails.addingNewRows}
                >
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={
                      !tableDetails.addNewRowsDetails.addingNewRows &&
                      _.isEmpty(tableDetails.addNewRowsDetails.newRowsDataUpdates)
                    }
                  >
                    <AddCircleOutline color="primary" />
                  </Badge>
                </IconButton>
              </MUITooltip>
            )}

            {showFilterButton && (
              <MUITooltip title={t('widget.Table.filterData', 'Filter Data')}>
                <IconButton onClick={() => showFilters()}>
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!tableDetails.filterDetails.filters.length > 0}
                  >
                    <FilterList color="primary" />
                  </Badge>
                </IconButton>
              </MUITooltip>
            )}
            {showDownloadButton && (
              <MenuCustom
                titleTooltip={t('globals.download', 'Download')}
                Icon={<Download color="primary" />}
              >
                <MenuItem
                  onClick={() => {
                    exportData('csv', true);
                  }}
                >
                  {t('widget.Table.download', 'Download')} CSV
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportData('xlsx', true);
                  }}
                >
                  {t('widget.Table.download', 'Download')} Excel
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportData('pdf', true);
                  }}
                >
                  {t('widget.Table.download', 'Download')} PDF
                </MenuItem>
              </MenuCustom>
            )}
            {!hideColumnSelectorButton && (
              <MenuCustom
                titleTooltip={t('widget.Table.column', 'Column')}
                Icon={<ViewWeek color="primary" />}
              >
                <FormGroup sx={{ minWidth: '150px' }}>
                  <IndeterminateCheckbox
                    {...getToggleHideAllColumnsProps()}
                    label={t('globals.selectAll', 'SelectAll')}
                  />

                  {allColumns.map(
                    (column, index) =>
                      typeof column.Header === 'string' && (
                        <FormControlLabel
                          defaultChecked
                          key={index}
                          {...column.getToggleHiddenProps()}
                          control={<Checkbox />}
                          label={` ${column.Header}`}
                          sx={{ minWidth: '100%', mx: '5px', pl: '5px' }}
                        />
                      )
                  )}
                </FormGroup>
              </MenuCustom>
            )}
          </Box>
        </Box>
      )}
      <Box className="table-responsive jet-data-table">
        <MUITable {...getTableProps()}>
          <TableHead sx={{ backgroundColor: '#E7E7E7' }}>
            {headerGroups.map((headerGroup, index) => (
              <DragDropContext
                key={index}
                onDragStart={() => {
                  currentColOrder.current = allColumns?.map((o) => o.id);
                }}
                onDragUpdate={(dragUpdateObj) => {
                  const colOrder = [...currentColOrder.current];
                  const sIndex = dragUpdateObj.source.index;
                  const dIndex = dragUpdateObj.destination && dragUpdateObj.destination.index;

                  if (typeof sIndex === 'number' && typeof dIndex === 'number') {
                    colOrder.splice(sIndex, 1);
                    colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                    setColumnOrder(colOrder);
                  }
                }}
              >
                <Droppable
                  droppableId="droppable"
                  direction="horizontal"
                >
                  {(droppableProvided, snapshot) => (
                    <TableRow
                      ref={droppableProvided.innerRef}
                      key={index}
                      {...headerGroup.getHeaderGroupProps()}
                      tabIndex="0"
                      sx={{ height: 'auto' }}
                    >
                      {headerGroup.headers.map((column, index) => (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                          isDragDisabled={!column.accessor}
                        >
                          {(provided, snapshot) => {
                            return (
                              <TableCell
                                key={index}
                                {...column.getHeaderProps()}
                                className={
                                  column.isSorted ? (column.isSortedDesc ? 'sort-desc th' : 'sort-asc th') : 'th'
                                }
                              >
                                <Box
                                  data-cy={`column-header-${String(column.exportValue)
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}`}
                                  {...column.getSortByToggleProps()}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  style={{
                                    ...getItemStyle(snapshot, provided.draggableProps.style),
                                  }}
                                >
                                  {column.render('Header')}
                                </Box>
                                <Box
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  draggable="true"
                                  {...column.getResizerProps()}
                                  className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                />
                              </TableCell>
                            );
                          }}
                        </Draggable>
                      ))}
                    </TableRow>
                  )}
                </Droppable>
              </DragDropContext>
            ))}
          </TableHead>

          {!loadingState && page.length === 0 && (
            <Box
              width="100%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {t('widget.Table.noData', 'no data')}
            </Box>
          )}

          {!loadingState && (
            <TableBody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <TableRow
                    key={index}
                    className={`table-row table-editor-component-row ${
                      allowSelection &&
                      highlightSelectedRow &&
                      ((row.isSelected && row.id === tableDetails.selectedRowId) ||
                        (showBulkSelector &&
                          row.isSelected &&
                          tableDetails?.selectedRowsDetails?.some((singleRow) => singleRow.selectedRowId === row.id)))
                        ? 'selected'
                        : ''
                    }`}
                    {...row.getRowProps()}
                    onClick={async (e) => {
                      e.stopPropagation();
                      // toggleRowSelected will triggered useRededcuer function in useTable and in result will get the selectedFlatRows consisting row which are selected
                      if (allowSelection) {
                        await toggleRowSelected(row.id);
                      }
                      const selectedRow = row.original;
                      const selectedRowId = row.id;
                      setExposedVariables({ selectedRow, selectedRowId }).then(() => {
                        mergeToTableDetails({ selectedRow, selectedRowId });
                        fireEvent('onRowClicked');
                      });
                    }}
                    onMouseOver={(e) => {
                      if (hoverAdded) {
                        const hoveredRowDetails = {
                          hoveredRowId: row.id,
                          hoveredRow: row.original,
                        };
                        setRowDetails(hoveredRowDetails);
                        hoverRef.current = rowDetails?.hoveredRowId;
                      }
                    }}
                    onMouseLeave={(e) => {
                      hoverAdded && setRowDetails({ hoveredRowId: '', hoveredRow: '' });
                    }}
                  >
                    {row.cells.map((cell, index) => {
                      let cellProps = cell.getCellProps();
                      if (tableDetails.changeSet) {
                        if (tableDetails.changeSet[cell.row.index]) {
                          const currentColumn = columnData.find((column) => column.id === cell.column.id);
                          if (
                            _.get(tableDetails.changeSet[cell.row.index], currentColumn?.accessor, undefined) !==
                            undefined
                          ) {
                            cellProps.style.backgroundColor = darkMode ? '#1c252f' : '#ffffde';
                            cellProps.style['--tblr-table-accent-bg'] = darkMode ? '#1c252f' : '#ffffde';
                          }
                        }
                      }
                      const wrapAction = textWrapActions(cell.column.id);
                      const rowChangeSet = changeSet ? changeSet[cell.row.index] : null;
                      const cellValue = rowChangeSet ? rowChangeSet[cell.column.name] || cell.value : cell.value;
                      const rowData = tableData[cell.row.index];
                      const cellBackgroundColor = resolveReferences(
                        cell.column?.cellBackgroundColor,
                        currentState,
                        '',
                        {
                          cellValue,
                          rowData,
                        }
                      );
                      const cellTextColor = resolveReferences(cell.column?.textColor, currentState, '', {
                        cellValue,
                        rowData,
                      });
                      const actionButtonsArray = actions.map((action) => {
                        return {
                          ...action,
                          isDisabled: resolveReferences(action?.disableActionButton ?? false, currentState, '', {
                            cellValue,
                            rowData,
                          }),
                        };
                      });
                      const isEditable = resolveReferences(cell.column?.isEditable ?? false, currentState, '', {
                        cellValue,
                        rowData,
                      });
                      return (
                        // Does not require key as its already being passed by react-table via cellProps
                        // eslint-disable-next-line react/jsx-key
                        <TableCell
                          data-cy={`${cell.column.columnType ?? ''}${String(
                            cell.column.id === 'rightActions' || cell.column.id === 'leftActions' ? cell.column.id : ''
                          )}${String(cellValue ?? '').toLocaleLowerCase()}-cell-${index}`}
                          {...cellProps}
                          onClick={(e) => {
                            setExposedVariable('selectedCell', {
                              columnName: cell.column.exportValue,
                              columnKey: cell.column.key,
                              value: cellValue,
                            });
                          }}
                        >
                          <Box
                            className={`td-container ${
                              cell.column.columnType === 'image' && 'jet-table-image-column'
                            } ${cell.column.columnType !== 'image' && `w-100 h-100`}`}
                          >
                            <GenerateEachCellValue
                              cellValue={cellValue}
                              globalFilter={state.globalFilter}
                              cellRender={cell.render('Cell', {
                                cell,
                                actionButtonsArray,
                                isEditable,
                              })}
                              rowChangeSet={rowChangeSet}
                              isEditable={isEditable}
                              columnType={cell.column.columnType}
                              isColumnTypeAction={['rightActions', 'leftActions'].includes(cell.column.id)}
                              cellTextColor={cellTextColor}
                              cell={cell}
                              currentState={currentState}
                            />
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </MUITable>
        {loadingState === true && (
          <Box
            height="100%"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress size={50} />
          </Box>
        )}
      </Box>

      {(clientSidePagination || serverSidePagination || Object.keys(tableDetails.changeSet || {}).length > 0) && (
        <Box
          display="flex"
          justifyContent="space-between"
          height="70px"
          alignItems="center"
        >
          <Box>
            {(clientSidePagination || serverSidePagination) && (
              <Pagination
                lastActivePageIndex={pageIndex}
                serverSide={serverSidePagination}
                autoGotoPage={gotoPage}
                autoCanNextPage={canNextPage}
                autoPageCount={pageCount}
                autoPageOptions={pageOptions}
                onPageIndexChanged={onPageIndexChanged}
                pageIndex={paginationInternalPageIndex}
                setPageIndex={setPaginationInternalPageIndex}
                enableNextButton={enableNextButton}
                enablePrevButton={enablePrevButton}
              />
            )}
          </Box>
          <Box margin="0px 10px">
            {showBulkUpdateActions && Object.keys(tableDetails.changeSet || {}).length > 0 ? (
              <Box
                display="flex"
                gap="10px"
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    onEvent('onBulkUpdate', { component }).then(() => {
                      handleChangesSaved();
                    })
                  }
                  data-cy={`table-button-save-changes`}
                >
                  Save Changes
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => handleChangesDiscarded()}
                  data-cy={`table-button-discard-changes`}
                >
                  Discard changes
                </Button>
              </Box>
            ) : (
              <Typography
                data-cy={`footer-number-of-records`}
                variant="body1"
              >
                {clientSidePagination &&
                  !serverSidePagination &&
                  `${globalFilteredRows.length} ${t('widget.Table.records', 'Records')}`}
                {serverSidePagination && totalRecords ? `${totalRecords} ${t('widget.Table.records', 'Records')}` : ''}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {tableDetails.filterDetails.filtersVisible && (
        <Filter
          openFilter={tableDetails.filterDetails.filtersVisible}
          hideFilters={hideFilters}
          filters={tableDetails.filterDetails.filters}
          columns={columnData.map((column) => {
            return { name: column.Header, value: column.id };
          })}
          mergeToFilterDetails={mergeToFilterDetails}
          filterDetails={tableDetails.filterDetails}
          darkMode={darkMode}
          setAllFilters={setAllFilters}
          fireEvent={fireEvent}
        />
      )}
      {tableDetails.addNewRowsDetails.addingNewRows && (
        <AddNewRowComponent
          openAddRow={tableDetails.addNewRowsDetails.addingNewRows}
          hideAddNewRowPopup={hideAddNewRowPopup}
          tableType={tableType}
          darkMode={darkMode}
          mergeToAddNewRowsDetails={mergeToAddNewRowsDetails}
          onEvent={onEvent}
          component={component}
          setExposedVariable={setExposedVariable}
          allColumns={allColumns}
          defaultColumn={defaultColumn}
          columns={columnsForAddNewRow}
          addNewRowsDetails={tableDetails.addNewRowsDetails}
          utilityForNestedNewRow={utilityForNestedNewRow}
        />
      )}
    </Box>
  );
}
