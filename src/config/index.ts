import * as dotenv from 'dotenv';
import convict from 'convict';
dotenv.config();

const config = convict({
  port: {
    doc: 'The port express is served on.',
    format: Number,
    default: 5000,
    env: 'APP_PORT',
  }
});

export default config;
