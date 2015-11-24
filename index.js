import React from 'react';
import ReactRedux from 'react-redux';

import { createConnect } from './src';

export const connect = createConnect(React, ReactRedux);
