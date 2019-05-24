import React from "react";
import get from "lodash/get";

export function AmazonPolly(props) {
  const { caption, className = "amazon-polly", story, config, audioAttributes = { controls: true } } = props;
  const cdnName = get(config, ["cdn-name"]);
  const audioS3Key = get(story, ["story-audio", "s3-key"]);
  const audioSrc = `${cdnName}${audioS3Key}`;

  return <figure className={`${className}-wrapper`}>
      <figcaption className={`${className}-caption`}>{caption}</figcaption>
      <audio className={`${className}-audio`} src={audioSrc} {...audioAttributes}>
        Your browser doesn't support the <code>audio</code> element.
      </audio>
    </figure>;
}