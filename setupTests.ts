import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

// Provide TextEncoder to JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as never;
