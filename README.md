An SQL Query Builder Based on React.
![example](/assets/img/tree.jpg)
## How To Use

```bash
npm install react-sql-query-builder
```
or
```bash
yarn add react-sql-query-builder
```

```js
import Querybuilder from 'react-sql-query-builder'
```

```js
  /**
   * Optional fields
    */
  const rightFields = [{ name: "OtherId", id: 1 }, { name: "OtherUser", id: 2 }];
  const fields = [
    { name: "ID", id: 119 },
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
        { name: 'equal', id: 1, symbol: '=' },
        { name: 'not equal', id: 2, symbol: '!=' },
        { name: 'is not null', id: 3, symbol: 'is not null' },
        { name: 'is null', id: 4, symbol: 'is null' },
        { name: 'in', id: 5, symbol: 'in' },
        { name: 'not in', id: 6, symbol: 'not in' },
        { name: 'less', id: 7, symbol: 'less' },
        { name: 'less or equal', id: 8, symbol: 'less or equal' },
        { name: 'greater', id: 9, symbol: 'greater' },
        { name: 'greater or equal', id: 10, symbol: 'greater or equal' }
      ];
  <Querybuilder 
    fields={fields} 
    operators={operators} 
    onChange={(data) => {console.log(data)}} 
  />
```
