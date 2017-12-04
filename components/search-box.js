import React from 'react';
import {NavigationComponentBase} from "./navigation-component-base";

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
    this.props.onSubmitHandler(this.state.query);
  }

  render() {
    const Render = this.props.template || (x => x.children);
    return <form role="search" action="/search" onSubmit={(e) => this.onSubmit(e)} className={this.props.className}>
      <Render>
        <input type="search"
                name="q"
                placeholder={this.props.placeholder}
                value={this.state.query}
                onChange={(e) => this.setState({query: e.target.value})}
                className={this.props.inputClassName}/>
      </Render>
    </form>
  }

}
