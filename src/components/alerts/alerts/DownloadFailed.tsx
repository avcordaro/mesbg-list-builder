import { Fragment } from "react";

export const DownloadFailed = () => {
  return (
    <Fragment>
      <b>Downloading failed</b>
      <p>
        Sorry, something went wrong while downloading the files. Please try
        again later or contact us if the problem persists.
      </p>
    </Fragment>
  );
};
