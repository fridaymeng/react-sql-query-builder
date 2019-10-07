import React from "react";
// import Querybuilder from "./tree";
import Querybuilder from "react-sql-query-builder";

/**
 * Optional fields
 */
const rightFields = [{ name: "OtherId", id: 1 }, { name: "OtherUser", id: 2 }];
const fields = [
  { name: "ID", id: 1 },
  { name: "User", id: 2 },
  {
    name: "Age",
    id: 3,
    type: "SelectList",
    rightFields: rightFields
  },
  { name: "Nation", id: 4 },
  { name: "Date Picker", id: 5, type: "DatePicker" },
  { name: "Month Picker", id: 6, type: "MonthPicker" },
  { name: "Range Picker", id: 7, type: "RangePicker" }
];
/**
 * Optional operators
 */
const operators = [
  { name: "equal", id: 1, symbol: "=" },
  { name: "not equal", id: 2, symbol: "!=" },
  { name: "is not null", id: 3, symbol: "is not null", rightFields: false },
  { name: "is null", id: 4, symbol: "is null", rightFields: false },
  { name: "in", id: 5, symbol: "in" },
  { name: "not in", id: 6, symbol: "not in" },
  { name: "less", id: 7, symbol: "less" },
  { name: "less or equal", id: 8, symbol: "less or equal" },
  { name: "greater", id: 9, symbol: "greater" },
  { name: "greater or equal", id: 10, symbol: "greater or equal" }
];

function App() {
  return (
    <div className="App">
      <Querybuilder
        fields={fields}
        operators={operators}
        onChange={data => {
          // console.log(data);
        }}
      />
    </div>
  );
}

export default App;
