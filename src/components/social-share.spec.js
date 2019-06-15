import { SocialShare } from '..';
import { Provider } from 'react-redux';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect'
import { createStore } from 'redux';
import React from 'react';

afterEach(cleanup);

describe("SocialShare", () => {
  it("URL encodes the title for twitter", () => {
    const {container} = render(
      <Provider store={createStore(x => x, { qt: { config: {} } })}>
        <SocialShare
          fullUrl="https://www.google.com"
          title="Amazing Link"
          hashtags="awesome"
          template={({ twitterUrl }) => <span>{twitterUrl}</span>} />
      </Provider>
    )

    expect(container.firstChild).toHaveTextContent("https://twitter.com/intent/tweet?url=https://www.google.com&text=Amazing Link&hashtags=awesome");
  });
})
