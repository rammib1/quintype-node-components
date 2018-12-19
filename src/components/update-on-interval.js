import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

export class UpdateOnInterval extends Component {
    constructor(props){
        super(props);
        this.fetchIntervalIndex = -1;
        this.state = {
            data : {}
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
        const data = await this.getData();
        this.setState({data});
    }

    async getData() {
        const { dataLoader } = this.props;
        return await (typeof dataLoader === 'function') ? dataLoader() : null;
    }

    decorateData() {
        if(this.props.dataKey){
            return {[this.props.dataKey] : this.state.data};
        }
        return this.state.data;
    }


    render() {
        const cloneProps = Object.assign({}, this.props, this.decorateData());
        const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, cloneProps));
        return <Fragment>
            { childrenWithProps }
        </Fragment>;
    }
}

UpdateOnInterval.defaultProps = {
    interval : 30000,
    dataLoader : () => console.warn('dataloader required')
};

UpdateOnInterval.propTypes = {
    interval : PropTypes.number,
    dataLoader : PropTypes.func.isRequired,
    dataKey: PropTypes.string
};