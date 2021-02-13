import { Trans } from '@lingui/macro';
import React from 'react';
import { TableRow, TableRowColumn } from '../../../../UI/Table';
import IconButton from '../../../../UI/IconButton';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import TextField from '../../../../UI/TextField';
import styles from './styles';
import ThemeConsumer from '../../../../UI/Theme/ThemeConsumer';
import Text from '../../../../UI/Text';
import { parseFloatSafe } from '../../../../Utils/StringHelpers';

const PointRow = ({
  pointName,
  nameError,
  onBlur,
  onRemove,
  pointX,
  pointY,
  onChangePointX,
  onChangePointY,
  onEdit,
  isAutomatic,
}) => (
  <ThemeConsumer>
    {muiTheme => (
      <TableRow
        style={{
          backgroundColor: muiTheme.list.itemsBackgroundColor,
        }}
      >
        <TableRowColumn style={styles.handleColumn}>
          {/* <DragHandle /> Reordering point is not supported for now */}
        </TableRowColumn>
        <TableRowColumn>
          <TextField
            margin="none"
            defaultValue={pointName || 'Base layer'}
            id={pointName}
            fullWidth
            errorText={nameError ? 'This name is already taken' : undefined}
            disabled={!onBlur}
            onBlur={onBlur}
          />
        </TableRowColumn>
        <TableRowColumn style={styles.coordinateColumn}>
          {!isAutomatic ? (
            <TextField
              margin="none"
              value={pointX}
              type="number"
              id="point-x"
              onChange={(e, value) => onChangePointX(parseFloatSafe(value))}
            />
          ) : (
            <Text noMargin>
              <Trans>(auto)</Trans>
            </Text>
          )}
        </TableRowColumn>
        <TableRowColumn style={styles.coordinateColumn}>
          {!isAutomatic ? (
            <TextField
              margin="none"
              value={pointY}
              type="number"
              id="point-y"
              onChange={(e, value) => onChangePointY(parseFloatSafe(value))}
            />
          ) : (
            <Text noMargin>
              <Trans>(auto)</Trans>
            </Text>
          )}
        </TableRowColumn>
        <TableRowColumn style={styles.toolColumn}>
          {!!onRemove && (
            <IconButton size="small" onClick={onRemove}>
              <Delete />
            </IconButton>
          )}
          {!!onEdit && (
            <IconButton size="small" onClick={onEdit}>
              <Edit />
            </IconButton>
          )}
        </TableRowColumn>
      </TableRow>
    )}
  </ThemeConsumer>
);

export default PointRow;
