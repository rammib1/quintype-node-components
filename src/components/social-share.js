import React from "react";
import {connect} from "react-redux";
import {get} from "lodash";
import {withError} from './with-error';

function SocialShareBase(props) {
  const fullUrl = `${props.publisherUrl}/${props.url}`;
  const hashtags = props.hashtags ? props.hashtags : '';
  let share = get(global, ["navigator", "share"]);

  function handleShare() {
    if (share) {
      share({
        title: props.title,
        url: fullUrl,
      });
    }
  }

  let handleShareFn = share ? handleShare : null;

  return React.createElement(props.template, Object.assign({
    fbUrl: `https://www.facebook.com/sharer.php?u=${fullUrl}`,
    twitterUrl: `https://twitter.com/intent/tweet?url=${fullUrl}&text=${props.title}&hashtags=${hashtags}`,
    gplusUrl: `https://plus.google.com/share?url=${fullUrl}`,
    linkedinUrl: `https://www.linkedin.com/shareArticle?url=${fullUrl}&title=${props.title}`,
    whatsappUrl: `https://api.whatsapp.com/send?text=${fullUrl}`,
    mailtoUrl: `mailto:${''}?subject=${props.title}&body=${fullUrl}`,
    handleShare: handleShareFn
  }, props));
}


function mapStateToProps(state) {
  return {
    publisherUrl: state.qt.config["sketches-host"]
  };
}


export const SocialShare = connect(mapStateToProps, {})(withError(SocialShareBase));
