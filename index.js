import React from 'react';
import * as ReactRedux from 'react-redux';

import { createConnect, createShape } from './src';
export const connect = createConnect(React, ReactRedux);
export const shape = createShape(React);

export * from './src';
