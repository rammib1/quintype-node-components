import React from 'react';
import {NavigationComponentBase} from "./navigation-component-base";

function DefaultTemplate({children}) {
  return children;
}

export class SearchBox extends NavigationComponentBase {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
  }

  onSubmit(e) {
    e.preventDefault();
    if(this.state.query != "")
      this.navigateTo(`/search?q=${this.state.query}`)
    if(this.props.onSubmitHandler)
      this.props.onSubmitHandler(this.state.query);
  }

  keyPress(e) {
    if(e.keyCode == 27)
      this.props.onEscape && this.props.onEscape();
  }

  componentDidUpdate() {
    this.textInput.focus();
  }

  onInputFocus(e) {
    const temp = e.target.value;
    e.target.value = '';
    e.target.value = temp;
  }

  render() {
    const Render = this.props.template || DefaultTemplate;
    return <form role="search" action="/search" onSubmit={(e) => this.onSubmit(e)} className={this.props.className} ref={this.props.formRef}>
      <Render>
        <input type="search"
               name="q"
               placeholder={this.props.placeholder}
               value={this.state.query}
               onChange={(e) => this.setState({query: e.target.value})}
               className={this.props.inputClassName}
               id={this.props.inputId}
               ref={(input) => this.textInput = input}
               onFocus={(e) => this.onInputFocus(e)}
               onKeyDown={(e) => this.keyPress(e)}/>
      </Render>
    </form>
  }

}
