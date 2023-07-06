import * as _ from 'lodash';

import { Menu } from './menu';

import FontFaceObserver from 'fontfaceobserver';

const css = require("./snake.css");

// Create a font loader
let font = new FontFaceObserver('Bruce Forever', {});

font.load()

let menu = new Menu();