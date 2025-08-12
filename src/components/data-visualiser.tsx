'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Grid from './grid';
import { useRef, useState } from 'react';

import {
  balanceSheetData,
  cashFlowData,
  financialRatiosData,
  incomeStatementData,
} from '@/data';
import { HotTableRef } from '@handsontable/react-wrapper';
import { SelectedCells } from '@/types';
import { HyperFormula } from 'hyperformula';
const initialData = {
  balanceSheet: balanceSheetData,
  incomeStatement: incomeStatementData,
  cashFlow: cashFlowData,
  financialRatios: financialRatiosData,
};

const DataVisualiser = () => {
  const [activePage, setActivePage] = useState('balanceSheet');
  const [data, setData] = useState(initialData);
  const [selectedCells, setSelectedCells] = useState<SelectedCells>({});

  const hotTableRefs = {
    balanceSheet: useRef<HotTableRef>(null),
    incomeStatement: useRef<HotTableRef>(null),
    cashFlow: useRef<HotTableRef>(null),
    financialRatios: useRef<HotTableRef>(null),
  };

  const hfInstance = HyperFormula.buildFromSheets({
    balanceSheet: balanceSheetData.data,
    incomeStatementSheet: incomeStatementData.data,
    cashFlowSheet: cashFlowData.data,
    financialRatiosSheet: financialRatiosData.data,
  });

  const handleAfterSelection = (
    sheetKey: string,
    row: number,
    col: number,
    row2: number,
    col2: number
  ) => {
    setSelectedCells((prev) => ({
      ...prev,
      [sheetKey]: { row, col, row2, col2 },
    }));
  };

  return (
    <Tabs
      value={activePage}
      onValueChange={setActivePage}
      className="w-full flex flex-col flex-1 gap-0 rounded-none"
    >
      {Object.entries(data).map(([key, data]) => (
        <TabsContent key={key} value={key}>
          <Grid
            handleAfterSelection={handleAfterSelection}
            ref={hotTableRefs[key as keyof typeof hotTableRefs]}
            sheetName={key}
            sheet={data}
            hfInstance={hfInstance}
            selectedCells={selectedCells[key as keyof typeof selectedCells]}
          />
        </TabsContent>
      ))}

      <TabsList className="h-12 rounded-none">
        {Object.entries(data).map(([key, data]) => (
          <TabsTrigger className="rounded-none" key={key} value={key}>
            {data.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default DataVisualiser;
