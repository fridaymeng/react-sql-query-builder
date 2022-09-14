import React from "react";
import RuleList from './ruleList.js';
import uuid from '../utils/uuid';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: this.props.rules
    };
    this.generateKey(this.props.rules);
    this.handleCondition = this.handleCondition.bind(this);
    this.handleAddRule = this.handleAddRule.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
    this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    this.idChange = this.idChange.bind(this);
    this.operatorChange = this.operatorChange.bind(this);
    this.valChange = this.valChange.bind(this);
    this.getOperatorVisible = this.getOperatorVisible.bind(this);
  }
  componentDidMount() {
  }
  getOperatorVisible (id) {
    const arr = this.props.operators.filter(item => item.value === 'disabled').map(item => item.id)
    return !arr.includes(id)
  }
  generateKey (rules) {
    rules.forEach(item => {
      item.key = uuid()
      if (item.rules) this.generateKey(item.rules)
    })
  }
  updateRules () {
    this.setState({
      rules: this.state.rules
    })
    this.props.handleChange(this.state.rules);
  }
  findRulesById (rules, id, callback) {
    rules.forEach((item, index) => {
      if (item.id === id) {
        callback(item, rules, index)
      }
      if (item.rules) this.findRulesById(item.rules, id, callback)
    })
  }
  handleCondition (val) {
    this.findRulesById(this.state.rules, val, (item) => {
      item.condition = item.condition === "AND" ? "OR" : "AND";
    })
    this.updateRules()
  }
  handleAddRule (val) {
    this.findRulesById(this.state.rules, val, (item) => {
      item.rules.push({
        id: this.props.fields[0].id,
        operator: this.props.operators[0].id,
        value: '',
        key: uuid()
      })
    })
    this.updateRules()
  }
  handleAddGroup (val) {
    this.findRulesById(this.state.rules, val, (item) => {
      item.rules.push({
        condition: 'OR',
        id: Number.parseInt(Math.random() * 100000),
        key: uuid(),
        rules: [{
          id: this.props.fields[0].id,
          key: uuid(),
          operator: this.props.operators[0].id,
          value: ''
        }]
      })
    })
    this.updateRules()
  }
  handleDeleteGroup (val) {
    this.findRulesById(this.state.rules, val, (item, itemRules, itemIndex) => {
      itemRules.splice(itemIndex, 1)
    })
    this.updateRules()
  }
  idChange (id, val) {
    this.findRulesById(this.state.rules, id, (item) => {
      item.id = val;
    })
    this.updateRules();
  }
  operatorChange (id, val) {
    this.findRulesById(this.state.rules, id, (item) => {
      item.operator = val;
    })
    this.updateRules();
  }
  valChange (id, val) {
    this.findRulesById(this.state.rules, id, (item) => {
      item.value = val;
    })
    this.updateRules();
  }
  render() {
    return <div className="wrap">
      <RuleList
        rules={this.state.rules}
        fields={this.props.fields}
        operators={this.props.operators}
        getOperatorVisible={this.getOperatorVisible}
        handleCondition={this.handleCondition}
        handleAddRule={this.handleAddRule}
        handleAddGroup={this.handleAddGroup}
        handleDeleteGroup={this.handleDeleteGroup}
        idChange={this.idChange}
        operatorChange={this.operatorChange}
        valChange={this.valChange}
      />
    </div>;
  }
}
export default App;