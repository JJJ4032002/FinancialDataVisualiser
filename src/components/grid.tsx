'use client';
import { SheetData } from '@/data';
import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
import Handsontable from 'handsontable';
import { BaseRenderer, registerRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { RefObject, useEffect } from 'react';
import { HyperFormula } from 'hyperformula';
// register Handsontable's modules
registerAllModules();

const negativeValueRenderer: BaseRenderer = (
  instance,
  td,
  row,
  col,
  prop,
  value,
  cellProperties
) => {
  Handsontable.renderers.TextRenderer(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  );

  // if the row contains a negative number
  if (parseInt(value, 10) < 0) {
    // add class 'make-me-red'
    td.style.color = '#ef4444';
  }

  if (!value || value === '') {
    td.style.background = 'rgb(238, 238, 238, 0.4)';
  }
};
registerRenderer('negativeValueRenderer', negativeValueRenderer);
const Grid = ({
  sheet,
  handleAfterSelection,
  sheetName,
  ref,
  selectedCells,
  hfInstance,
}: {
  sheet: SheetData;
  handleAfterSelection: (
    sheetKey: string,
    row: number,
    col: number,
    row2: number,
    col2: number
  ) => void;
  sheetName: string;
  ref: RefObject<HotTableRef | null>;
  selectedCells: { row: number; col: number; row2: number; col2: number };
  hfInstance: HyperFormula;
}) => {
  useEffect(() => {}, [sheetName]);
  return (
    <HotTable
      ref={ref}
      themeName="ht-theme-main"
      rowHeaders={true}
      colHeaders={true}
      data={sheet.data}
      width={'100%'}
      height={'calc(100vh - 122px)'}
      autoWrapRow={true}
      stretchH="all"
      renderAllRows={false}
      minRows={50}
      formulas={{ engine: hfInstance }}
      undo={true}
      minCols={26}
      autoWrapCol={true}
      afterSelection={(row, col, row2, col2) => {
        if (!selectedCells) {
          handleAfterSelection(sheetName, row, col, row2, col2);
        } else {
          if (
            selectedCells.row !== row ||
            selectedCells.col !== col ||
            selectedCells.row2 !== row2 ||
            selectedCells.col2 !== col2
          ) {
            handleAfterSelection(sheetName, row, col, row2, col2);
          }
        }
      }}
      afterRender={() => {
        const hotInstance = ref.current?.hotInstance;
        const selected = hotInstance?.getSelected();
        if (
          !selected &&
          selectedCells &&
          Object.keys(selectedCells).length > 0
        ) {
          hotInstance?.selectCell(
            selectedCells.row,
            selectedCells.col,
            selectedCells.row2,
            selectedCells.col2
          );
        }
      }}
      cells={function () {
        const cellProperties: Handsontable.CellMeta = {};
        cellProperties.renderer = 'negativeValueRenderer';
        return cellProperties;
      }}
      contextMenu={['copy', 'cut', 'commentsAddEdit']}
      selectionMode="multiple"
      mergeCells={sheet.merges}
      comments={true}
      licenseKey="non-commercial-and-evaluation" // for non-commercial use only
    />
  );
};

export default Grid;
