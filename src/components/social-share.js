import React from "react";
import { connect } from "react-redux";
import { withError } from "./with-error";

function SocialShareBase(props) {
  const fullUrl = `${props.publisherUrl}/${props.url}`;
  const hashtags = props.hashtags ? props.hashtags : "";

  return React.createElement(
    props.template,
    Object.assign(
      {
        fbUrl: `https://www.facebook.com/sharer.php?u=${fullUrl}`,
        twitterUrl: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${
          props.title
        }&hashtags=${hashtags}`,
        gplusUrl: `https://plus.google.com/share?url=${fullUrl}`,
        linkedinUrl: `https://www.linkedin.com/shareArticle?url=${fullUrl}&title=${
          props.title
        }`,
        whatsappUrl: `https://api.whatsapp.com/send?text=${fullUrl}`,
        mailtoUrl: `mailto:${""}?subject=${props.title}&body=${fullUrl}`
      },
      props
    )
  );
}

function mapStateToProps(state) {
  return {
    publisherUrl: state.qt.config["sketches-host"]
  };
}

export const SocialShare = connect(
  mapStateToProps,
  {}
)(withError(SocialShareBase));
