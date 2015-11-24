import React from 'react-native';
import ReactRedux from 'react-redux/native';

import { createConnect } from './src';

export const connect = createConnect(React, ReactRedux);
