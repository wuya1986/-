import React from 'react';

import {
  MediaBox,
  MediaBoxBody,
  MediaBoxDescription,
  MediaBoxTitle,
} from 'react-weui';

const CompanyItem = ({ company, linkto }) => (
  <MediaBox type="appmsg" href={linkto}>
    <MediaBoxBody>
      <MediaBoxTitle>
        {company.title}
      </MediaBoxTitle>
      <MediaBoxDescription>
        {company.abstract}
      </MediaBoxDescription>
    </MediaBoxBody>
  </MediaBox>
);

export default CompanyItem;
