import React from 'react-native';
import * as ReactRedux from 'react-redux/native';

import { createConnect, createShape } from './src';
export const connect = createConnect(React, ReactRedux);
export const shape = createShape(React);

export * from './src';
