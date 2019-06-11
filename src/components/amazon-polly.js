import React from "react";
import get from "lodash/get";

export class AmazonPolly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  onClickHandler = () => {
    this.setState({
      isOpen: true
    })
  }

  closeHandler = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {  
    const { caption, className = "amazon-polly", story, config, audioAttributes = { controls: true } } = this.props;
    const cdnName = get(config, ["cdn-name"]);
    const audioS3Key = get(story, ["story-audio", "s3-key"]);
    const audioSrc = `${cdnName}${audioS3Key}`;

    return <div className={`${className}-wrapper`}>
      <div className={`${className}-text-wrapper`} onClick={this.onClickHandler}>
        <svg></svg>
        <span className={`${className}-text`}>Listen to story</span>
      </div>
      {!this.state.isOpen ? null : <div className={`${className}-bar-wrapper`}>
        <figure className={`${className}-content`}>
          <figcaption className={`${className}-caption`}>{caption}</figcaption>
          <audio className={`${className}-audio`} src={audioSrc} {...audioAttributes}>
            Your browser doesn't support the <code>audio</code> element.
          </audio>
        </figure>
        <div className={`${className}-close`} onClick={this.closeHandler}>
          <svg></svg>
        </div>
      </div>}
    </div>;
  }
}