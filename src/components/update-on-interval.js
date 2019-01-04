import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class UpdateOnInterval extends Component {
    constructor(props){
        super(props);
        this.fetchIntervalIndex = -1;
        this.state = {
            data: this.props.initData
        };
    }

    componentDidMount() {
        this.registerInterval();
    }

    componentWillMount() {
        this.unregisterInterval();
    }

    registerInterval() {
        this.fetchIntervalIndex = setInterval(() => this.setData(), this.props.interval);
    }

    unregisterInterval() {
        clearInterval(this.fetchIntervalIndex);
    }

    async setData() {
        const data = typeof this.props.dataLoader === 'function' ? await this.props.dataLoader() : {};
        this.setState({data});
    }

    render() {
        const {children} = this.props;
        const {data} = this.state;
        return children({data});
    }
}

UpdateOnInterval.defaultProps = {
    interval : 30000,
    initData: {}
};

UpdateOnInterval.propTypes = {
    interval : PropTypes.number,
    dataLoader : PropTypes.func.isRequired,
    initData : PropTypes.any.isRequired
};