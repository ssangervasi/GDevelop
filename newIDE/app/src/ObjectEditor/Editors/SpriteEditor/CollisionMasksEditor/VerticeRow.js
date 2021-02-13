import React from 'react';
import { TableRow, TableRowColumn } from '../../../../UI/Table';
import IconButton from '../../../../UI/IconButton';
import Delete from '@material-ui/icons/Delete';
import TextField from '../../../../UI/TextField';
import Warning from '@material-ui/icons/Warning';
import styles from './styles';
import ThemeConsumer from '../../../../UI/Theme/ThemeConsumer';
import { parseFloatSafe } from '../../../../Utils/StringHelpers';

const VerticeRow = ({
  hasWarning,
  canRemove,
  onRemove,
  verticeX,
  verticeY,
  onChangeVerticeX,
  onChangeVerticeY,
}) => (
  <ThemeConsumer>
    {muiTheme => (
      <TableRow
        style={{
          backgroundColor: muiTheme.list.itemsBackgroundColor,
        }}
      >
        <TableRowColumn style={styles.handleColumn}>
          {/* <DragHandle /> Reordering vertices is not supported for now */}
        </TableRowColumn>
        <TableRowColumn>{hasWarning && <Warning />}</TableRowColumn>
        <TableRowColumn style={styles.coordinateColumn}>
          <TextField
            margin="none"
            value={verticeX}
            type="number"
            id="vertice-x"
            onChange={(e, value) => onChangeVerticeX(parseFloatSafe(value))}
          />
        </TableRowColumn>
        <TableRowColumn style={styles.coordinateColumn}>
          <TextField
            margin="none"
            value={verticeY}
            type="number"
            id="vertice-y"
            onChange={(e, value) => onChangeVerticeY(parseFloatSafe(value))}
          />
        </TableRowColumn>
        <TableRowColumn style={styles.toolColumn}>
          {!!onRemove && (
            <IconButton size="small" onClick={onRemove} disabled={!canRemove}>
              <Delete />
            </IconButton>
          )}
        </TableRowColumn>
      </TableRow>
    )}
  </ThemeConsumer>
);

export default VerticeRow;
